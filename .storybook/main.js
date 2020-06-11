const configOverrides = require("../config-overrides");

module.exports = {
	stories: ["../src/**/**/*.stories.tsx"],
	addons: [
		"@storybook/addon-actions/register",
		"@storybook/addon-knobs/register",
		"storybook-addon-i18next/register",
		"@storybook/preset-create-react-app",
	],
	webpackFinal: async (storybookConfig) => {
		const customConfig = configOverrides(storybookConfig);

		(storybookConfig.module.rules = [
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
		]),
			storybookConfig.resolve.extensions.push(".ts", ".tsx");

		return {
			...storybookConfig,
			module: { ...storybookConfig.module, rules: customConfig.module.rules },
		};
	},
};
