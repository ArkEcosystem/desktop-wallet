const path = require("path");
const { override, addPostcssPlugins } = require("customize-cra");

module.exports = {
	stories: ["../src/**/**/*.stories.tsx"],
	addons: [
		"@storybook/addon-actions/register",
		"@storybook/addon-knobs/register",
		"storybook-addon-i18next/register",
		"@storybook/preset-create-react-app",
		"storybook-addon-themes",
	],
	webpackFinal: override(
		addPostcssPlugins([
			require("postcss-import"),
			require("tailwindcss")("./src/tailwind.config.js"),
			require("autoprefixer"),
		]),
		async (storybookConfig) => {
			storybookConfig.module.rules = [
				...storybookConfig.module.rules,
				{
					test: /\.(ts|tsx)$/,
					use: [
						{
							loader: require.resolve("babel-loader"),
							options: {
								presets: [require.resolve("babel-preset-react-app")],
							},
						},
						require.resolve("react-docgen-typescript-loader"),
					],
				},
			];

			storybookConfig.resolve = {
				extensions: [".ts", ".js", ".jsx", ".tsx", ".scss", ".json", ".node"],
				alias: {
					app: path.resolve(__dirname, "../src/app/"),
					domains: path.resolve(__dirname, "../src/domains"),
					resources: path.resolve(__dirname, "../src/resources"),
					styles: path.resolve(__dirname, "../src/styles"),
					utils: path.resolve(__dirname, "../src/utils"),
					tests: path.resolve(__dirname, "../src/tests"),
					fs: path.resolve(__dirname, "mocks/fsMock.js"),
				},
			};

			console.log(storybookConfig);

			return storybookConfig;
		},
	),
};
