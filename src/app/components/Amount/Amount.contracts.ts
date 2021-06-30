import { CURRENCIES } from "@arkecosystem/platform-sdk-intl";

const DEFAULT_DECIMALS = 8;
const DEFAULT_TICKER = "BTC";

type CurrencyKey = keyof typeof CURRENCIES;

interface AmountProperties {
	ticker?: string;
	value: number;
	showSign?: boolean;
	showTicker?: boolean;
	isNegative?: boolean;
	locale?: string;
	className?: string;
}

interface FormatParameters {
	locale?: string;
	value: number;
	ticker?: string;
}

export { DEFAULT_DECIMALS, DEFAULT_TICKER };

export type { AmountProperties, CurrencyKey, FormatParameters };
