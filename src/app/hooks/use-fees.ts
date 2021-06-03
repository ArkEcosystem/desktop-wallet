import { Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useEnvironmentContext } from "app/contexts";
import { useCallback } from "react";

const normalizeValue = (value: string): string => (+BigNumber.make(value).toHuman()).toString();

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
				static: normalizeValue(transactionFees.static),
				avg: normalizeValue(transactionFees.avg),
				min: normalizeValue(transactionFees.min),
				max: normalizeValue(transactionFees.max),
			};
		},
		[env, normalize, profile],
	);

	return { findByType };
};
