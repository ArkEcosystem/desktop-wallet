import { CURRENCIES, Money, Numeral } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";

interface AmountProperties {
	ticker: string;
	value: number;
	locale?: string;
	showSign?: boolean;
	isNegative?: boolean;
}
type FormatProperties = AmountProperties & { decimals: number };
type Properties = AmountProperties & Omit<React.HTMLProps<any>, "value">;

interface CurrencyConfig {
	symbol: string;
	decimals: number;
}

type ExchangeCurrencyList = keyof typeof CURRENCIES;

const formatSign = (amount: string, isNegative: boolean) => `${isNegative ? "-" : "+"} ${amount}`;

const formatFiat = ({ ticker, value, decimals }: FormatProperties): string => {
	const cents = BigNumber.make(value).times(Math.pow(10, decimals)).decimalPlaces(0).toNumber();
	const money = Money.make(cents, ticker);
	return money.format();
};

const formatCrypto = ({ ticker, value, decimals, locale }: FormatProperties): string => {
	const numeral = Numeral.make(locale, {
		minimumFractionDigits: 0,
		maximumFractionDigits: decimals,
		currencyDisplay: "name",
	}).formatAsCurrency(+value, "BTC");

	/**
	 * Intl.NumberFormat throws error for some tickers like DARK (?)
	 */
	return numeral.replace("BTC", ticker.toUpperCase());
};

export const Amount = ({ ticker, value, locale, showSign, isNegative, ...properties }: Properties) => {
	const tickerConfig: CurrencyConfig | undefined = CURRENCIES[ticker as ExchangeCurrencyList];
	const decimals = tickerConfig?.decimals || 8;
	const isFiat = decimals <= 2;
	const amount = (isFiat ? formatFiat : formatCrypto)({ ticker, value, locale, decimals });

	return (
		<span data-testid="Amount" {...properties}>
			{showSign ? formatSign(amount, !!isNegative) : amount}
		</span>
	);
};

Amount.defaultProps = {
	locale: "en",
};
