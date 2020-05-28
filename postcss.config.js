module.exports = {
  plugins: [require("postcss-import")(), require("tailwindcss")("./new_tailwind.config.js"), require("autoprefixer")],
};
