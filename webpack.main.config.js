const { ESBuildPlugin } = require("esbuild-loader");

module.exports = {
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "esbuild-loader",
				options: {
					loader: "tsx",
					target: "es2015",
				},
			},
		],
	},
	resolve: {
		extensions: [".js", ".ts"],
	},
	plugins: [new ESBuildPlugin()],
};
