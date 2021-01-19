import { TransactionFee } from "@arkecosystem/platform-sdk/dist/contracts";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useEnvironmentContext } from "app/contexts";
import { useCallback } from "react";

type FeeInput = string | number | BigNumber;

export const useFees = () => {
	const { env } = useEnvironmentContext();

	const formatWithDefaultStatic = useCallback((fees: TransactionFee) => {
		const isZero = (fee: FeeInput) => BigNumber.make(fee).isZero() || BigNumber.make(fee).isNegative();
		const setWithFallback = (fee: FeeInput, fallbackFee: FeeInput) =>
			!fee || isZero(fee) ? String(fallbackFee) : String(fee);

		return {
			avg: setWithFallback(fees.avg, fees.static),
			min: setWithFallback(fees.min, fees.static),
			max: setWithFallback(fees.max, fees.static),
			static: fees.static,
		};
	}, []);

	const findByType = useCallback(
		async (coin: string, network: string, type: string) => {
			let transactionFees: TransactionFee;

			try {
				transactionFees = env.fees().findByType(coin, network, type);
			} catch (error) {
				await env.fees().syncAll();
				transactionFees = env.fees().findByType(coin, network, type);
			}

			return formatWithDefaultStatic(transactionFees);
		},
		[env, formatWithDefaultStatic],
	);

	return {
		formatWithDefaultStatic,
		findByType,
	};
};
