import { CURRENCIES } from "@arkecosystem/platform-sdk/dist/data";
import { Money, Numeral } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";

type AmountProps = {
	ticker: string;
	value: BigNumber;
	locale?: string;
	showSign?: boolean;
	normalize?: boolean;
	isNegative?: boolean;
};
type FormatProps = AmountProps & { decimals: number };
type Props = AmountProps & Omit<React.HTMLProps<any>, "value">;

type CurrencyConfig = {
	symbol: string;
	decimals: number;
};

type ExchangeCurrencyList = keyof typeof CURRENCIES;

const formatSign = (amount: string, isNegative: boolean) => `${isNegative ? "-" : "+"} ${amount}`;

const formatFiat = ({ ticker, value, decimals }: FormatProps): string => {
	const cents = value.times(Math.pow(10, decimals)).decimalPlaces(0).toNumber();
	const money = Money.make(cents, ticker);
	return money.format();
};

const formatCrypto = ({ ticker, value, decimals, locale, normalize }: FormatProps): string => {
	const numeral = Numeral.make(locale!, {
		minimumFractionDigits: 0,
		maximumFractionDigits: decimals,
		currencyDisplay: "name",
	}).formatAsCurrency(normalize ? +value.toHuman(decimals) : +value, "BTC");

	/**
	 * Intl.NumberFormat throws error for some tickers like DARK (?)
	 */
	const money = numeral.replace("BTC", ticker.toUpperCase());
	return money;
};

export const Amount = ({ ticker, value, locale, showSign, normalize, isNegative, ...props }: Props) => {
	const tickerConfig: CurrencyConfig | undefined = CURRENCIES[ticker as ExchangeCurrencyList];
	const decimals = tickerConfig?.decimals || 8;
	const isFiat = decimals <= 2;
	const amount = (isFiat ? formatFiat : formatCrypto)({ ticker, value, locale, decimals, normalize });

	return (
		<span data-testid="Amount" {...props}>
			{showSign ? formatSign(amount, !!isNegative) : amount}
		</span>
	);
};

Amount.defaultProps = {
	locale: "en",
	normalize: true,
};
