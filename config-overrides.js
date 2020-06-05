const { override, addPostcssPlugins } = require("customize-cra");

module.exports = override(
	addPostcssPlugins([require("postcss-import"), require("tailwindcss")("./src/tailwind.config.js"), require("autoprefixer")]),
);
