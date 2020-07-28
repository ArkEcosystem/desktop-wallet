const path = require("path");
const { override, addPostcssPlugins, addWebpackPlugin } = require("customize-cra");
const webpack = require("webpack");

module.exports = override(
	addPostcssPlugins([
		require("postcss-import"),
		require("tailwindcss")("./src/tailwind.config.js"),
		require("autoprefixer"),
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
			"usb-detection": "commonjs usb-detection",
		};

		config.target = "electron-renderer";

		config.resolve = {
			extensions: [".ts", ".js", ".jsx", ".tsx", ".scss", ".json", ".node"],
			alias: {
				app: path.resolve(__dirname, "src/app/"),
				domains: path.resolve(__dirname, "src/domains"),
				resources: path.resolve(__dirname, "src/resources"),
				styles: path.resolve(__dirname, "src/styles"),
				utils: path.resolve(__dirname, "src/utils"),
				tests: path.resolve(__dirname, "src/tests"),
			},
		};

		config.module.rules.push({
			test: /\.(ts|js|jsx|tsx)$/,
			exclude: /node_modules/,
			use: {
				loader: require.resolve("babel-loader"),
				options: {
					presets: [require.resolve("@babel/preset-react"), require.resolve("@babel/preset-typescript")],
					babelrc: false,
				},
			},
		});

		config.module.rules.push({
			test: /\.node$/,
			use: "node-loader",
		});

		config.optimization = {
			usedExports: true,
			providedExports: true,
			sideEffects: true,
			namedChunks: true,
			namedModules: true,
			removeAvailableModules: true,
			mergeDuplicateChunks: true,
			flagIncludedChunks: true,
			removeEmptyChunks: true,
		};

		return config;
	},
);
