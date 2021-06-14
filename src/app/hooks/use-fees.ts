import { Coins, Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
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
				return {
					static: transactionFees.static.toString(),
					avg: transactionFees.avg.toString(),
					min: transactionFees.min.toString(),
					max: transactionFees.max.toString(),
				};
			}

			const bigNumber = profile.coins().get(coin, network).bigNumber();

			return {
				static: bigNumber.make(transactionFees.static).toHuman(),
				avg: bigNumber.make(transactionFees.avg).toHuman(),
				min: bigNumber.make(transactionFees.min).toHuman(),
				max: bigNumber.make(transactionFees.max).toHuman(),
			};
		},
		[env, normalize, profile],
	);

	return { findByType };
};
