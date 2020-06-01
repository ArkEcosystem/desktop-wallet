const os = require("os");
const path = require("path");

exports.APP = {
	website: "https://ark.io",
	transactionExpiryMinutes: 45,
};

exports.I18N = {
	defaultLocale: "en-US",
	enabledLocales: ["en-US"],
};

exports.BIP39 = {
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

exports.INTERVALS = {
	short: 30000, // 30 seconds
	medium: 60000, // 1 minute
	long: 180000, // 3 minute
};

// This section handles fetching Desktop-Wallet Plugins from the NPM registry.
// It should remain "ARK" unless intentionally implementing a custom package.
exports.PLUGINS = {
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

exports.THEMES = [
	{
		id: "light",
		title: "Light theme", // TODO translate
	},
	{
		id: "dark",
		title: "Dark theme", // TODO translate
	},
];
