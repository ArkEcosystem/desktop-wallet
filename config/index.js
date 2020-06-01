const os = require("os");
const path = require("path");

export const I18N = {
	defaultLocale: "en-US",
	enabledLocales: ["en-US"],
};

export const BIP39 = {
	defaultLanguage: "english",
	languages: [
		"chinese_simplified",
		"chinese_traditional",
		"english",
		"french",
		"italian",
		"japanese",
		"korean",
		"spanish",
	],
};

export const INTERVALS = {
	short: 30000, // 30 seconds
	medium: 60000, // 1 minute
	long: 180000, // 3 minute
};

// This section handles fetching Desktop-Wallet Plugins from the NPM registry.
// It should remain "ARK" unless intentionally implementing a custom package.
export const PLUGINS = {
	adapters: ["npm"],
	pluginsUrl: "https://raw.githubusercontent.com/ark-ecosystem-desktop-plugins/config/master/plugins.json",
	categories: ["gaming", "theme", "language", "utility", "other"],
	devPath: path.resolve(os.homedir(), ".ark-desktop/plugins-dev"),
	maxKeywords: 5,
	keywords: ["@arkecosystem", "desktop-wallet", "plugin"],
	officialScope: "arkecosystem",
	officialAuthor: "ARK Ecosystem",
	path: path.resolve(os.homedir(), ".ark-desktop/plugins"),
	reportUrl: "https://ark.io/contact",
	sharePath: path.resolve(os.homedir(), ".ark-desktop/share"),
	updateInterval: {
		value: 1,
		method: "addDays",
	},
	validation: require("./plugin-validation.json"),
};

export const THEMES = [
	{
		id: "light",
		title: "Light theme", // TODO translate
	},
	{
		id: "dark",
		title: "Dark theme", // TODO translate
	},
];

/**
 * These are the new values that will be used as defaults for forms and other things reliant on defaults.
 */

export const MARKET_PROVIDERS = {
	coingecko: "CoinGecko",
	coincap: "CoinCap",
	cryptocompare: "CryptoCompare",
};

export const CURRENCIES = {
	btc: "BTC",
	eth: "ETH",
	ltc: "LTC",
	aud: "AUD",
	brl: "BRL",
	cad: "CAD",
	chf: "CHF",
	cny: "CNY",
	eur: "EUR",
	gbp: "GBP",
	hkd: "HKD",
	idr: "IDR",
	inr: "INR",
	jpy: "JPY",
	krw: "KRW",
	mxn: "MXN",
	rub: "RUB",
	usd: "USD",
};
