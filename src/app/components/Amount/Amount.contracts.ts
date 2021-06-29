import { CURRENCIES } from "@arkecosystem/platform-sdk-intl";

const DEFAULT_DECIMALS = 8;

type CurrencyKey = keyof typeof CURRENCIES;

interface AmountProperties {
	ticker: string;
	value: number;
	withSign?: boolean;
	isNegative?: boolean;
	locale?: string;
	className?: string;
}

interface FormatParameters {
	locale?: string;
	value: number;
	ticker: string;
}

export { DEFAULT_DECIMALS };

export type { AmountProperties, CurrencyKey, FormatParameters };
