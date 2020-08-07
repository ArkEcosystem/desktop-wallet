const { override, addPostcssPlugins, addWebpackExternals, setWebpackTarget } = require("customize-cra");
const nodeExternals = require("webpack-node-externals");

const injectTailwindCSS = () =>
	addPostcssPlugins([
		require("postcss-import"),
		require("tailwindcss")("./src/tailwind.config.js"),
		require("autoprefixer"),
	]);

module.exports = override(
	injectTailwindCSS(),
	addWebpackExternals([
		nodeExternals({
			allowlist: [/tippy/, /swipe/],
		}),
	]),
	setWebpackTarget("electron-renderer"),
);

module.exports.injectTailwindCSS = injectTailwindCSS;
