/**
 * These options are intended to be used with drop-down menus.
 *
 * All of them correspond to values that the Platform SDK and
 * its various components can understand and correspond to as
 * you would expect without having to implement any wrappers.
 */
export const PlatformSdkChoices = {
	marketProviders: [
		{ label: "CoinCap", value: "coincap" },
		{ label: "CoinGecko", value: "coingecko" },
		{ label: "CryptoCompare", value: "cryptocompare" },
	],
	passphraseLanguages: [
		{ label: "Chinese Simplified", value: "chinese_simplified" },
		{ label: "Chinese Traditional", value: "chinese_traditional" },
		{ label: "English", value: "english" },
		{ label: "French", value: "french" },
		{ label: "Italian", value: "italian" },
		{ label: "Japanese", value: "japanese" },
		{ label: "Korean", value: "korean" },
		{ label: "Spanish", value: "spanish" },
	],
	currencies: [
		{ label: "BTC (Ƀ)", value: "BTC" },
		{ label: "ETH (Ξ)", value: "ETH" },
		{ label: "LTC (Ł)", value: "LTC" },
		{ label: "AUD (A$)", value: "AUD" },
		{ label: "BRL (R$)", value: "BRL" },
		{ label: "CAD (C$)", value: "CAD" },
		{ label: "CHF (CHF)", value: "CHF" },
		{ label: "CNY (¥)", value: "CNY" },
		{ label: "EUR (€)", value: "EUR" },
		{ label: "GBP (£)", value: "GBP" },
		{ label: "HKD (HK$)", value: "HKD" },
		{ label: "IDR (IDR)", value: "IDR" },
		{ label: "INR (₹)", value: "INR" },
		{ label: "JPY (¥)", value: "JPY" },
		{ label: "KRW (₩)", value: "KRW" },
		{ label: "MXN (MX$)", value: "MXN" },
		{ label: "RUB (₽)", value: "RUB" },
		{ label: "USD ($)", value: "USD" },
	],
	languages: [{ label: "English", value: "en-US" }],
	timeFormats: [
		{ label: "12h", value: "h:mm A" },
		{ label: "24h", value: "HH:mm" },
	],
};
