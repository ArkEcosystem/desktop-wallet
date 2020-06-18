const { override, addPostcssPlugins, addWebpackPlugin, addWebpackAlias } = require("customize-cra");
const webpack = require("webpack");

module.exports = override(
	addPostcssPlugins([
		require("postcss-import"),
		require("tailwindcss")("./src/tailwind.config.js"),
		require("autoprefixer"),
	]),
	addWebpackPlugin(
		new webpack.NormalModuleReplacementPlugin(
			/node_modules\/@arkecosystem\/crypto\/node_modules\/bcrypto\/lib\/native\/bn\.js/,
			"../js/bn.js",
		),
	),
	addWebpackAlias({
		"@ledgerhq/hw-transport-node-hid-singleton": "@ledgerhq/hw-transport-u2f",
	}),
	(config) => {
		config.node = {
			fs: "empty",
		};
		return config;
	},
);
