const path = require("path");
const { override, addPostcssPlugins } = require("customize-cra");
const { dependencies } = require("./package.json");

const customConfig = {
	target: "electron-renderer",
	node: {
		__dirname: process.env.NODE_ENV !== "production",
		__filename: process.env.NODE_ENV !== "production",
		fs: "empty",
		net: "empty",
		dns: "empty",
		tls: "empty",
	},
	externals: {
		"usb-detection": "commonjs usb-detection",
	},
};

module.exports = override(
	addPostcssPlugins([
		require("postcss-import"),
		require("tailwindcss")("./src/tailwind.config.js"),
		require("autoprefixer"),
	]),
	(config) => {
		const overridedConfig = {
			...config,
			...customConfig,
		};

		overridedConfig.module.rules.push({
			test: /\.node$/,
			use: "node-loader",
		});

		return overridedConfig;
	},
);
