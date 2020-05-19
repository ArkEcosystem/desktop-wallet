"use strict";
module.exports = {
    plugins: [
        require('postcss-import')(),
        require('tailwindcss')('./tailwind.js'),
        require('autoprefixer')
    ]
};
//# sourceMappingURL=postcss.config.js.map