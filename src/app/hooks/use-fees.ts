import { Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { useEnvironmentContext } from "app/contexts";
import { useCallback } from "react";
import { TransactionFees } from "types";

export const useFees = (profile: ProfileContracts.IProfile) => {
	const { env } = useEnvironmentContext();

	const findByType = useCallback(
		async (coin: string, network: string, type: string): Promise<TransactionFees> => {
			let transactionFees: Services.TransactionFee;

			try {
				transactionFees = env.fees().findByType(coin, network, type);
			} catch {
				await env.fees().syncAll(profile);

				transactionFees = env.fees().findByType(coin, network, type);
			}

			return {
				avg: transactionFees.avg.toHuman(),
				max: transactionFees.max.toHuman(),
				min: transactionFees.min.toHuman(),
				static: transactionFees.static.toHuman(),
			};
		},
		[env, profile],
	);

	return { findByType };
};
