const path = require("path");
const { override, addWebpackAlias, addWebpackModuleRule } = require("customize-cra");
const { injectTailwindCSS } = require("../config-overrides");

const injectNode = () =>
	addWebpackAlias({
		fs: path.resolve(__dirname, "mocks/fsMock.js"),
	});

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
		injectTailwindCSS(),
		injectNode(),
		addWebpackModuleRule({
			test: /\.(ts|tsx)$/,
			use: [
				{
					loader: "babel-loader",
					options: {
						presets: ["babel-preset-react-app"],
					},
				},
				"react-docgen-typescript-loader",
			],
		}),
	),
};
