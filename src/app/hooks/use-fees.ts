import { Coins, Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useEnvironmentContext } from "app/contexts";
import { useCallback } from "react";

const normalizeValue = (value: BigNumber, decimals: number): string => BigNumber.make(value, decimals).toHuman();

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

			const config = profile.coins().get(coin, network).config();
			const decimals = config.get<number>(Coins.ConfigKey.CurrencyDecimals);

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
