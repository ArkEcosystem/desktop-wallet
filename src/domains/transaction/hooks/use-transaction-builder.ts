import { Contracts, Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";
import Transport from "@ledgerhq/hw-transport";
import { useLedgerContext } from "app/contexts";

interface SignInput {
	encryptionPassword?: string;
	mnemonic?: string;
	secondMnemonic?: string;
	wallet: ProfileContracts.IReadWriteWallet;
}
type SignFn = (input: any, options?: Services.TransactionOptions) => Promise<string>;
type ConnectFn = (profile: ProfileContracts.IProfile, coin: string, network: string) => Promise<void>;

const prepareMultiSignature = (
	input: Services.TransactionInputs,
	wallet: ProfileContracts.IReadWriteWallet,
): Services.TransactionInputs => ({
	...input,
	nonce: wallet.nonce().plus(1).toFixed(),
	sign: {
		multiSignature: wallet.multiSignature().all(),
	},
});

const prepareLedger = async (
	profile: ProfileContracts.IProfile,
	input: Services.TransactionInputs,
	wallet: ProfileContracts.IReadWriteWallet,
	signFn: SignFn,
	connectFn: ConnectFn,
	transport: typeof Transport,
) => {
	await connectFn(profile, wallet.coinId(), wallet.networkId());

	await wallet.ledger().connect(transport);

	const path = wallet.data().get<string>(ProfileContracts.WalletData.DerivationPath);
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
		input: Services.TransactionInputs,
		wallet: ProfileContracts.IReadWriteWallet,
		options?: {
			abortSignal?: AbortSignal;
		},
	): Promise<{ uuid: string; transaction: Contracts.SignedTransactionData }> => {
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
			)(prepareLedger(profile, data, wallet, signFn, connect, transport));
		}

		const uuid = await signFn(data);

		return {
			uuid,
			transaction: wallet.transaction().transaction(uuid),
		};
	};

	return { build };
};
