const { override, addPostcssPlugins, setWebpackTarget, addWebpackExternals } = require("customize-cra");
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

module.exports = override(
	setWebpackTarget("electron-renderer"),
	injectTailwindCSS(),
	addNodeExternals({
		allowlist: [/tippy/, /swipe/],
	}),
);

module.exports.injectTailwindCSS = injectTailwindCSS;
