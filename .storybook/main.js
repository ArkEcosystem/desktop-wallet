const path = require("path");

module.exports = {
	stories: ["../src/**/*.stories.[tj]s"],

	webpackFinal: (config) => {
		config.module.rules = config.module.rules.filter((rule) => !/(vue|css)/.test(rule.test));

		config.module.rules.push(
			{
				test: /\.tsx?$/,
				use: [
					"babel-loader",
					{
						loader: "ts-loader",
						options: {
							appendTsSuffixTo: [/\.vue$/],
						},
					}
				]
			},
			{
				test: /\.postcss$/,
				use: ["vue-style-loader", "postcss-loader"],
			},
			{
				test: /\.css$/,
				sideEffects: true,
				use: [
					"vue-style-loader",
					{
						loader: "css-loader",
						options: { importLoaders: 1 },
					},
					{
						loader: "postcss-loader",
						options: {
							config: {
								path: path.resolve(__dirname, "../"),
							},
						},
					},
				],
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					extractCSS: true,
					loaders: {
						sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax=1",
						scss: "vue-style-loader!css-loader!sass-loader",
						less: "vue-style-loader!css-loader!less-loader",
					},
				},
			},
		);

		config.resolve.extensions.push(".ts", ".tsx", ".vue", ".css");

		config.node = {
			fs: "empty",
		};

		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.join(__dirname, "../src/renderer"),
		};

		return config;
	},
};
