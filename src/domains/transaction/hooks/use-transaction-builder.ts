import { Contracts, Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";
import Transport from "@ledgerhq/hw-transport";
import { useLedgerContext } from "app/contexts";

type SignFn = (input: any) => Promise<string>;
type ConnectFn = (profile: ProfileContracts.IProfile, coin: string, network: string) => Promise<void>;

const prepareMultiSignature = async (
	input: Services.TransactionInputs,
	wallet: ProfileContracts.IReadWriteWallet,
): Promise<Services.TransactionInputs> => ({
	...input,
	nonce: wallet.nonce().plus(1).toFixed(), // @TODO: let the PSDK handle this - needs some reworks for musig derivation
	signatory: await wallet
		.signatory()
		.multiSignature(wallet.multiSignature().all().min, wallet.multiSignature().all().publicKeys),
});

const prepareLedger = async (
	profile: ProfileContracts.IProfile,
	input: Services.TransactionInputs,
	wallet: ProfileContracts.IReadWriteWallet,
	connectFn: ConnectFn,
	transport: typeof Transport,
) => {
	await connectFn(profile, wallet.coinId(), wallet.networkId());

	await wallet.ledger().connect(transport);

	const signatory = await wallet
		.signatory()
		.ledger(wallet.data().get<string>(ProfileContracts.WalletData.DerivationPath)!);

	return {
		...input,
		signatory,
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
	const { abortConnectionRetry, transport, connect } = useLedgerContext();

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
			data = await prepareMultiSignature(data, wallet);
		}

		if (wallet.isLedger()) {
			data = await withAbortPromise(
				options?.abortSignal,
				abortConnectionRetry,
			)(prepareLedger(profile, data, wallet, connect, transport));
		}

		const uuid = await signFn(data);

		return {
			uuid,
			transaction: wallet.transaction().transaction(uuid),
		};
	};

	return { build };
};
