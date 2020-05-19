/**
 * Builds a sorting function for the given properties
 * @param {*} props
 * @param {*} locale
 * @param {*} options
 * @return {Function} Return the sorting function
 */
export default function sortByProps(props, locale, options) {
    if (locale === void 0) { locale = undefined; }
    if (options === void 0) { options = null; }
    locale = locale || undefined;
    options = options || { sensitivity: 'base', numeric: 'true' };
    if (!Array.isArray(props)) {
        props = [props];
    }
    return function (a, b) {
        for (var i = 0; i < props.length; i++) {
            var order = a[props[i]].toString().localeCompare(b[props[i]].toString(), locale, options);
            if (order !== 0) {
                return order;
            }
        }
    };
}
//# sourceMappingURL=sort-by-props.js.map