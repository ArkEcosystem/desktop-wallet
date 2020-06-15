const { override, addPostcssPlugins } = require("customize-cra");

module.exports = override(
	addPostcssPlugins([
		require("postcss-import"),
		require("tailwindcss")("./src/tailwind.config.js"),
		require("autoprefixer"),
	]),
	(config) => {
		(config.target = "electron-renderer"),
			(config.node = {
				net: "empty",
				dns: "empty",
				tls: "empty",
			});
		return config;
	},
);
