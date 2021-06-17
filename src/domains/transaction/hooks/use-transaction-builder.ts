import { Contracts, Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";
import { useLedgerContext } from "app/contexts";

type SignFunction = (input: any) => Promise<string>;

const prepareMultiSignature = async (
	input: Services.TransactionInputs,
	wallet: ProfileContracts.IReadWriteWallet,
): Promise<Services.TransactionInputs> => ({
	...input,
	nonce: wallet.nonce().plus(1).toFixed(0), // @TODO: let the PSDK handle this - needs some reworks for musig derivation
	signatory: await wallet
		.signatory()
		.multiSignature(wallet.multiSignature().all().min, wallet.multiSignature().all().publicKeys),
});

const prepareLedger = async (input: Services.TransactionInputs, wallet: ProfileContracts.IReadWriteWallet) => ({
	...input,
	signatory: await wallet.signatory().ledger(wallet.data().get<string>(ProfileContracts.WalletData.DerivationPath)!),
});

const withAbortPromise = (signal?: AbortSignal, callback?: () => void) => <T>(promise: Promise<T>) =>
	new Promise<T>((resolve, reject) => {
		if (signal) {
			signal.addEventListener('abort', () => {
				callback?.();
				reject("ERR_ABORT");
			});
		}

		return promise.then(resolve).catch(reject);
	});

export const useTransactionBuilder = () => {
	const { abortConnectionRetry } = useLedgerContext();

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
		const signFunction = (service[`sign${upperFirst(type)}`] as SignFunction).bind(service);
		let data = { ...input };

		if (wallet.isMultiSignature()) {
			data = await prepareMultiSignature(data, wallet);
		}

		if (wallet.isLedger()) {
			data = await withAbortPromise(options?.abortSignal, abortConnectionRetry)(prepareLedger(data, wallet));
		}

		const uuid = await signFunction(data);

		return {
			uuid,
			transaction: wallet.transaction().transaction(uuid),
		};
	};

	return { build };
};
