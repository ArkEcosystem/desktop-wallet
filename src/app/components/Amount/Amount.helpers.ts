import { CURRENCIES, Money, Numeral } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

import { DEFAULT_DECIMALS, DEFAULT_TICKER, FormatParameters } from "./Amount.contracts";

const getDecimalsByTicker = (ticker = DEFAULT_TICKER): number => {
	const key = ticker as keyof typeof CURRENCIES;
	return CURRENCIES[key]?.decimals ?? DEFAULT_DECIMALS;
};

const formatCrypto = ({ locale, value, ticker }: FormatParameters): string => {
	const decimals = getDecimalsByTicker(ticker);

	const numeral = Numeral.make(locale as string, {
		minimumFractionDigits: 0,
		maximumFractionDigits: decimals,
		currencyDisplay: "name",
	});

	// Intl.NumberFormat throws error for some tickers like DARK
	// so format as BTC then replace
	return numeral.formatAsCurrency(value, "BTC").replace("BTC", ticker.toUpperCase());
};

const formatFiat = ({ ticker, value }: FormatParameters): string => {
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
