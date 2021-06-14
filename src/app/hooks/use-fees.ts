import { Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { useEnvironmentContext } from "app/contexts";
import { useCallback } from "react";

export const useFees = (profile: ProfileContracts.IProfile) => {
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

			const bigNumber = profile.coins().get(coin, network).bigNumber();

			return {
				static: bigNumber.make(transactionFees.static).toHuman(),
				avg: bigNumber.make(transactionFees.avg).toHuman(),
				min: bigNumber.make(transactionFees.min).toHuman(),
				max: bigNumber.make(transactionFees.max).toHuman(),
			};
		},
		[env, profile],
	);

	return { findByType };
};
