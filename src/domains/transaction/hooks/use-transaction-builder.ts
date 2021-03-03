import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet, WalletData } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";

type SignFn = (input: any, options?: Contracts.TransactionOptions) => Promise<string>;

const prepareMultiSignature = (
	input: Contracts.TransactionInputs,
	wallet: ReadWriteWallet,
): Contracts.TransactionInputs => ({
	...input,
	nonce: wallet.nonce().plus(1).toFixed(),
	sign: {
		multiSignature: wallet.multiSignature(),
	},
});

const prepareLedger = async (input: Contracts.TransactionInputs, wallet: ReadWriteWallet, signFn: SignFn) => {
	const path = wallet.data().get<string>(WalletData.LedgerPath);
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

const withAbortPromise = (signal?: AbortSignal) => <T>(promise: Promise<T>) =>
	new Promise<T>((resolve, reject) => {
		if (signal) {
			signal.onabort = () => reject("ERR_ABORT");
		}

		return promise.then(resolve).catch(reject);
	});

export const useTransactionBuilder = (profile: Profile) => {
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
			data = await withAbortPromise(options?.abortSignal)(prepareLedger(data, wallet, signFn));
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
