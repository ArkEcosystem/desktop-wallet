import { Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { useEnvironmentContext } from "app/contexts";
import { useCallback } from "react";

export const useFees = ({ profile, normalize = true }: { profile: ProfileContracts.IProfile; normalize?: boolean }) => {
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

			if (!normalize) {
				return transactionFees;
			}

			return {
				static: transactionFees.static.toHuman(),
				avg: transactionFees.avg.toHuman(),
				min: transactionFees.min.toHuman(),
				max: transactionFees.max.toHuman(),
			};
		},
		[env, normalize, profile],
	);

	return { findByType };
};
