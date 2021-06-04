import { Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useEnvironmentContext } from "app/contexts";
import { useCallback } from "react";

const normalizeValue = (value: string, decimals: number): string =>
	BigNumber.make(value).denominated(decimals).toHuman();

export const useFees = ({ profile, normalize = true }: { profile: ProfileContracts.IProfile; normalize?: boolean }) => {
	const { env } = useEnvironmentContext();
	const decimals = 8;

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
				static: normalizeValue(transactionFees.static, decimals),
				avg: normalizeValue(transactionFees.avg, decimals),
				min: normalizeValue(transactionFees.min, decimals),
				max: normalizeValue(transactionFees.max, decimals),
			};
		},
		[env, normalize, profile],
	);

	return { findByType };
};
