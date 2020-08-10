const {
	override,
	addPostcssPlugins,
	addWebpackPlugin,
	setWebpackTarget,
	addWebpackExternals,
} = require("customize-cra");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

const addNodeExternals = ({ allowlist = [] }) =>
	addWebpackExternals([
		nodeExternals({
			allowlist,
		}),
	]);

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
					from: path.join(__dirname, "src/electron/index.js"),
					to: path.join(__dirname, "build/electron"),
				},
				{
					from: path.join(__dirname, "src/electron/menu.js"),
					to: path.join(__dirname, "build/electron"),
				},
			],
		}),
	);

module.exports = override(
	setWebpackTarget("electron-renderer"),
	injectTailwindCSS(),
	addNodeExternals({
		allowlist: [/tippy/, /swipe/],
	}),
	copyFiles(),
);

module.exports.injectTailwindCSS = injectTailwindCSS;
