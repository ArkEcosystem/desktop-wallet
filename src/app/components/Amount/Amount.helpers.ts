import { CURRENCIES, Money, Numeral } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

import { DEFAULT_DECIMALS, DEFAULT_TICKER, FormatParameters } from "./Amount.contracts";

const getDecimalsByTicker = (ticker: string): number => {
	const key = ticker as keyof typeof CURRENCIES;
	return CURRENCIES[key]?.decimals ?? DEFAULT_DECIMALS;
};

const formatCrypto = ({ locale, value, ...parameters }: FormatParameters): string => {
	const ticker = parameters.ticker || DEFAULT_TICKER;
	const decimals = getDecimalsByTicker(ticker);

	const numeral = Numeral.make(locale as string, {
		currencyDisplay: "name",
		maximumFractionDigits: decimals,
		minimumFractionDigits: 0,
	});

	// Intl.NumberFormat throws error for some tickers like DARK
	// so format as BTC then replace
	return numeral.formatAsCurrency(value, "BTC").replace("BTC", ticker.toUpperCase());
};

const formatFiat = ({ value, ...parameters }: FormatParameters): string => {
	// @TODO: remove ignore coverage after making ticker required
	/* istanbul ignore next */
	const ticker = parameters.ticker || DEFAULT_TICKER;
	const decimals = getDecimalsByTicker(ticker);

	const cents = BigNumber.make(value).times(Math.pow(10, decimals)).decimalPlaces(0).toNumber();
	const money = Money.make(cents, ticker);

	return money.format();
};

const formatWithSign = (amount: string, isNegative: boolean): string => {
	const sign = isNegative ? "-" : "+";
	return `${sign} ${amount}`;
};

export { formatCrypto, formatFiat, formatWithSign, getDecimalsByTicker };
