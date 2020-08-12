const {
	override,
	addPostcssPlugins,
	addWebpackExternals,
	addWebpackPlugin,
	setWebpackTarget,
} = require("customize-cra");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const { EnvironmentPlugin } = require("webpack");
const { dependencies } = require("./package.json");

const whiteListedModules = [
	"@arkecosystem/platform-sdk",
	"@arkecosystem/platform-sdk-ada",
	"@arkecosystem/platform-sdk-ark",
	"@arkecosystem/platform-sdk-atom",
	"@arkecosystem/platform-sdk-btc",
	"@arkecosystem/platform-sdk-crypto",
	"@arkecosystem/platform-sdk-eos",
	"@arkecosystem/platform-sdk-eth",
	"@arkecosystem/platform-sdk-intl",
	"@arkecosystem/platform-sdk-lsk",
	"@arkecosystem/platform-sdk-markets",
	"@arkecosystem/platform-sdk-neo",
	"@arkecosystem/platform-sdk-news",
	"@arkecosystem/platform-sdk-profiles",
	"@arkecosystem/platform-sdk-support",
	"@arkecosystem/platform-sdk-trx",
	"@arkecosystem/platform-sdk-xlm",
	"@arkecosystem/platform-sdk-xmr",
	"@arkecosystem/platform-sdk-xrp",
	"@arkecosystem/utils",
	"@tippyjs/react",
	"downshift",
	"framer-motion",
	"got",
	"hash-wasm",
	"i18next",
	"isomorphic-fetch",
	"recharts",
	"react",
	"react-dom",
	"react-error-boundary",
	"react-hook-form",
	"react-inlinesvg",
	"react-router-config",
	"react-scripts",
	"react-i18next",
	"react-range",
	"react-router-dom",
	"react-table",
	"styled-components",
	"swiper",
];

const addNodeExternals = () =>
	addWebpackExternals([...Object.keys(dependencies || {}).filter((d) => !whiteListedModules.includes(d))]);

const injectTailwindCSS = () =>
	addPostcssPlugins([
		require("postcss-import"),
		require("tailwindcss")("./src/tailwind.config.js"),
		require("autoprefixer"),
	]);

const copyFiles = () =>
	addWebpackPlugin(
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.join(__dirname, "src/electron"),
					to: path.join(__dirname, "build/electron"),
				},
			],
		}),
	);

module.exports = override(setWebpackTarget("electron-renderer"), injectTailwindCSS(), addNodeExternals(), copyFiles());

module.exports.injectTailwindCSS = injectTailwindCSS;
