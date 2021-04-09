import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";
import Transport from "@ledgerhq/hw-transport";
import { useLedgerContext } from "app/contexts";

type SignFn = (input: any, options?: Contracts.TransactionOptions) => Promise<string>;
type ConnectFn = (coin: string, network: string) => Promise<void>;

const prepareMultiSignature = (
	input: Contracts.TransactionInputs,
	wallet: ProfileContracts.IReadWriteWallet,
): Contracts.TransactionInputs => ({
	...input,
	nonce: wallet.nonce().plus(1).toFixed(),
	sign: {
		multiSignature: wallet.multiSignature(),
	},
});

const prepareLedger = async (
	input: Contracts.TransactionInputs,
	wallet: ProfileContracts.IReadWriteWallet,
	signFn: SignFn,
	connectFn: ConnectFn,
	transport: typeof Transport,
) => {
	await connectFn(wallet.coinId(), wallet.networkId());

	/*
	 * NOTE:
	 * Verify why BIP44 derived wallets requires to "reconnect"
	 * it seems that `wallet.ledger()` and `coin.ledger()` does not share the same instance
	 * but for legacy wallets it works
	 */

	await wallet.ledger().connect(transport);

	const path = wallet.data().get<string>(ProfileContracts.WalletData.LedgerPath);
	let senderPublicKey = wallet.publicKey();

	if (!senderPublicKey) {
		senderPublicKey = await wallet.coin().ledger().getPublicKey(path!);
	}

	const data = { ...input, sign: { senderPublicKey } };

	const id = await signFn(data, { unsignedBytes: true, unsignedJson: false });
	const unsignedTransaction = wallet.transaction().transaction(id);
	const bytes = Buffer.from(unsignedTransaction.toString(), "hex");
	const signature = await wallet.coin().ledger().signTransaction(path!, bytes);

	return {
		...data,
		nonce: wallet.nonce().plus(1).toFixed(),
		sign: {
			senderPublicKey,
			signature,
		},
	};
};

const withAbortPromise = (signal?: AbortSignal, callback?: () => void) => <T>(promise: Promise<T>) =>
	new Promise<T>((resolve, reject) => {
		if (signal) {
			signal.onabort = () => {
				callback?.();
				reject("ERR_ABORT");
			};
		}

		return promise.then(resolve).catch(reject);
	});

export const useTransactionBuilder = (profile: ProfileContracts.IProfile) => {
	const { connect, abortConnectionRetry, transport } = useLedgerContext();

	const build = async (
		type: string,
		input: Contracts.TransactionInputs,
		options?: {
			abortSignal?: AbortSignal;
		},
	): Promise<{ uuid: string; transaction: Contracts.SignedTransactionData }> => {
		const wallet = profile.wallets().findByAddress(input.from)!;
		const service = wallet.transaction();

		// @ts-ignore
		const signFn = (service[`sign${upperFirst(type)}`] as SignFn).bind(service);
		let data = { ...input };

		if (wallet.isMultiSignature()) {
			data = prepareMultiSignature(data, wallet);
		}

		if (wallet.isLedger()) {
			data = await withAbortPromise(
				options?.abortSignal,
				abortConnectionRetry,
			)(prepareLedger(data, wallet, signFn, connect, transport));
		}

		const uuid = await signFn(data);

		return {
			uuid,
			transaction: wallet.transaction().transaction(uuid),
		};
	};

	const broadcast = (id: string, input: Contracts.TransactionInputs) => {
		const wallet = profile.wallets().findByAddress(input.from)!;
		return wallet.transaction().broadcast(id);
	};

	return { build, broadcast };
};
