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
<<<<<<< HEAD
	]),
	addWebpackPlugin(
		new webpack.NormalModuleReplacementPlugin(
			/node_modules\/@arkecosystem\/crypto\/dist\/index\.bundled\.js/,
			"index.js",
		),
	),
	(config) => {
		config.node = {
			fs: "empty",
		};

		config.externals = {
			"node-hid": "commonjs node-hid",
			"usb-detection": "commonjs usb-detection",
		};

		config.target = "electron-renderer";

		config.resolve = {
			extensions: [".ts", ".js", ".jsx", ".tsx", ".scss", ".json", ".node"],
			alias: {
				app: path.resolve(__dirname, "src/app/"),
				data: path.resolve(__dirname, "src/data/"),
				domains: path.resolve(__dirname, "src/domains"),
				resources: path.resolve(__dirname, "src/resources"),
				styles: path.resolve(__dirname, "src/styles"),
				tests: path.resolve(__dirname, "src/tests"),
				utils: path.resolve(__dirname, "src/utils"),
			},
		};
=======
	]);
>>>>>>> 3.0-react

module.exports = override(
	setWebpackTarget("electron-renderer"),
	injectTailwindCSS(),
	addNodeExternals({
		allowlist: [/tippy/, /swipe/],
	}),
);

module.exports.injectTailwindCSS = injectTailwindCSS;
