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
		{ label: "BTC (Ƀ)", value: "btc" },
		{ label: "ETH (Ξ)", value: "eth" },
		{ label: "LTC (Ł)", value: "ltc" },
		{ label: "AUD (A$)", value: "aud" },
		{ label: "BRL (R$)", value: "brl" },
		{ label: "CAD (C$)", value: "cad" },
		{ label: "CHF (CHF)", value: "chf" },
		{ label: "CNY (¥)", value: "cny" },
		{ label: "EUR (€)", value: "eur" },
		{ label: "GBP (£)", value: "gbp" },
		{ label: "HKD (HK$)", value: "hkd" },
		{ label: "IDR (IDR)", value: "idr" },
		{ label: "INR (₹)", value: "inr" },
		{ label: "JPY (¥)", value: "jpy" },
		{ label: "KRW (₩)", value: "krw" },
		{ label: "MXN (MX$)", value: "mxn" },
		{ label: "RUB (₽)", value: "rub" },
		{ label: "USD ($)", value: "usd" },
	],
	languages: [{ label: "English", value: "en-US" }],
	timeFormats: [
		{ label: "12h", value: "h:mm A" },
		{ label: "24h", value: "HH:mm" },
	],
};
