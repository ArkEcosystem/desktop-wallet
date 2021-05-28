import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import Transport from "@ledgerhq/hw-transport";

type SignFn = (input: any, options?: Contracts.TransactionOptions) => Promise<string>;

const signWithLedger = async (
	message: string,
	wallet: ProfileContracts.IReadWriteWallet,
	transport: typeof Transport,
) => {
	await wallet.ledger().connect(transport);

	const path = wallet.data().get<string>(ProfileContracts.WalletData.LedgerPath);

	let signatory = wallet.publicKey();

	if (!signatory) {
		signatory = await wallet.coin().ledger().getPublicKey(path!);
	}

	const signature = await wallet.ledger().signMessage(path!, Buffer.from(message));

	return {
		signatory,
		message,
		signature,
	};
};

const withAbortPromise = (signal?: AbortSignal) => <T>(promise: Promise<T>) =>
	new Promise<T>((resolve, reject) => {
		if (signal) {
			signal.onabort = () => reject("ERR_ABORT");
		}

		return promise.then(resolve).catch(reject);
	});

export const useMessageSigner = (transport: typeof Transport) => {
	const sign = async (
		wallet: ProfileContracts.IReadWriteWallet,
		message: string,
		mnemonic?: string,
		wif?: string,
		options?: {
			abortSignal?: AbortSignal;
		},
	): Promise<Contracts.SignedMessage> => {
		if (wallet.isLedger()) {
			return withAbortPromise(options?.abortSignal)(signWithLedger(message, wallet, transport));
		}

		let signatory: any;

		if (mnemonic) {
			signatory = await wallet.signatory().mnemonic(mnemonic);
		}

		if (wif) {
			signatory = await wallet.signatory().wif(wif);
		}

		return wallet.message().sign({ message, signatory });
	};

	return { sign };
};
