import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { useEnvironmentContext } from "app/contexts";
import { useCallback } from "react";

interface Parameters_ {
	ticker?: string;
	exchangeTicker?: string;
}

interface UseExchangeRate {
	convert: (value?: number) => number;
}

export const useExchangeRate = ({ ticker, exchangeTicker }: Parameters_): UseExchangeRate => {
	const { env } = useEnvironmentContext();

	const convert = useCallback(
		(value?: number) => {
			if (!ticker || !exchangeTicker || !value) {
				return 0;
			}

			return env.exchangeRates().exchange(ticker, exchangeTicker, DateTime.make(), value);
		},
		[env, exchangeTicker, ticker],
	);

	return { convert };
};
