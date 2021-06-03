import { Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { useEnvironmentContext } from "app/contexts";
import { useCallback } from "react";

export const useFees = ({ profile }: { profile: ProfileContracts.IProfile }) => {
	const { env } = useEnvironmentContext();

	const findByType = useCallback(
		async (coin: string, network: string, type: string) => {
			let transactionFees: Services.TransactionFee;

			try {
				transactionFees = env.fees().findByType(coin, network, type);
			} catch (error) {
				await env.fees().syncAll(profile);
				transactionFees = env.fees().findByType(coin, network, type);
			}

			return transactionFees;
		},
		[env, profile],
	);

	return { findByType };
};
