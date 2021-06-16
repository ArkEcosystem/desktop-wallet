import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useEnvironmentContext } from "app/contexts";
import { useCallback } from "react";

interface Params {
	ticker?: string;
	exchangeTicker?: string;
}

interface UseExchangeRate {
	convert: (value: string) => BigNumber;
}

export const useExchangeRate = ({ ticker, exchangeTicker }: Params): UseExchangeRate => {
	const { env } = useEnvironmentContext();

	const convert = useCallback(
		(value: string) => {
			if (!ticker || !exchangeTicker) {
				return BigNumber.ZERO;
			}

			return env.exchangeRates().exchange(ticker, exchangeTicker, DateTime.make(), BigNumber.make(value));
		},
		[env, exchangeTicker, ticker],
	);

	return { convert };
};
