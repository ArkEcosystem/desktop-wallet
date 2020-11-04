import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";
import { formatLedgerDerivationPath } from "app/contexts";

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
	const data = { ...input, sign: { senderPublicKey: wallet.publicKey() } };
	const index = wallet.data().get<number>(WalletFlag.LedgerIndex);
	const slip44 = wallet.coin().config().get<number>("network.crypto.slip44");

	const id = await signFn(data, { unsignedBytes: true, unsignedJson: false });
	const unsignedTransaction = wallet.transaction().transaction(id);

	const path = formatLedgerDerivationPath(slip44, index!);
	const bytes = Buffer.from(unsignedTransaction.toString(), "hex");

	const signature = await wallet.coin().ledger().signTransactionWithSchnorr(path, bytes);

	return {
		...data,
		sign: {
			senderPublicKey: wallet.publicKey(),
			signature,
		},
	};
};

export const useTransactionBuilder = (profile: Profile) => {
	const build = async (
		type: string,
		input: Contracts.TransactionInputs,
	): Promise<Contracts.SignedTransactionData> => {
		// TODO: Proper handle errors

		const wallet = profile.wallets().findByAddress(input.from)!;
		const service = wallet.transaction();

		// @ts-ignore
		const signFn = (service[`sign${upperFirst(type)}`] as SignFn).bind(service);
		let data = { ...input };

		if (wallet.isMultiSignature()) {
			data = prepareMultiSignature(data, wallet);
		}

		if (wallet.isLedger()) {
			data = await prepareLedger(data, wallet, signFn);
		}

		const id = await signFn(data);
		return wallet.transaction().transaction(id);
	};

	const broadcast = (id: string, input: Contracts.TransactionInputs) => {
		// TODO: Proper handle errors

		const wallet = profile.wallets().findByAddress(input.from)!;
		return wallet.transaction().broadcast(id);
	};

	return { build, broadcast };
};
