const {
	override,
	addPostcssPlugins,
	addWebpackAlias,
	addWebpackExternals,
	addWebpackPlugin,
	setWebpackTarget,
} = require("customize-cra");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const { EnvironmentPlugin } = require("webpack");
const { dependencies } = require("./package.json");

const whiteListedModules = [
	"@arkecosystem/crypto",
	"@arkecosystem/platform-sdk",
	"@arkecosystem/platform-sdk-ada",
	"@arkecosystem/platform-sdk-ark",
	"@arkecosystem/platform-sdk-atom",
	"@arkecosystem/platform-sdk-btc",
	"@arkecosystem/platform-sdk-crypto",
	"@arkecosystem/platform-sdk-eos",
	"@arkecosystem/platform-sdk-eth",
	"@arkecosystem/platform-sdk-intl",
	"@arkecosystem/platform-sdk-ipfs",
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
	"hash-wasm",
	"i18next",
	"isomorphic-fetch",
	"react-dom",
	"react-error-boundary",
	"react-hook-form",
	"react-i18next",
	"react-inlinesvg",
	"react-linkify",
	"react-loading-skeleton",
	"react-range",
	"react-router-config",
	"react-router-dom",
	"react-scripts",
	"react-table",
	"react-toastify",
	"react",
	"recharts",
	"socks-proxy-agent",
	"styled-components",
	"swiper",
	"yup",
	"extract-domain",
	"react-visibility-sensor",
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

module.exports = override(
	setWebpackTarget("electron-renderer"),
	injectTailwindCSS(),
	addNodeExternals(),
	copyFiles(),
	addWebpackAlias({
		"@arkecosystem/crypto": "@arkecosystem/crypto/dist/index.esm.js",
		"@liskhq/lisk-cryptography": "@liskhq/lisk-cryptography/dist-browser/index.min.js",
		bytebuffer: "bytebuffer/dist/bytebuffer-node.js",
		memcpy: path.resolve(__dirname, "src/polyfill/memcpy.js"),
		history: "history/index.js",
	}),
);

module.exports.injectTailwindCSS = injectTailwindCSS;
