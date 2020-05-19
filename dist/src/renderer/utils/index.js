import sortByProps from './sort-by-props';
/**
 * Converts camelCaseString to UPPER_CAMEL_CASE_STRING
 * @param {String} String the camelCaseString
 * @returns {String} The UPPER_CAMEL_CASE
 */
var camelToUpperSnake = function (string) { return string.split(/(?=[A-Z])/).join('_').toUpperCase(); };
/**
 * Converts the first character of `string` to upper case and the remaining to lower case
 * @param {String} str
 * @return {String} Return the capitalized string
 */
var capitalize = function (str) { return "" + str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); };
/**
 * Flattens `array` a single level deep
 * @param {Array} arr
 * @return {Array} Return the new flattened array
 */
var flatten = function (arr) { return arr.reduce(function (a, b) { return a.concat(b); }, []); };
/**
 * Checks if `value` is an empty object, collection, map, or set
 * @param {*} val
 * @return {Boolean} Return `true` if `value` is empty, else `false`
 */
var isEmpty = function (val) { return [Object, Array].includes((val || {}).constructor) && !Object.entries((val || {})).length; };
/**
 * Checks if `value` is `null` or `undefined`
 * @param {*} val
 * @return {Boolean} Return `true` if `value` is nullish, else `false`
 */
var isNil = function (val) { return val === null || val === undefined; };
/**
 * Computes the maximum value of `array`
 * @param {Array} nums
 * @return {*} Return the maximum value
 */
var max = function (nums) {
    if (nums.length) {
        return Math.max.apply(Math, nums);
    }
};
/**
 * Computes the minimum value of `array`
 * @param {Array} nums
 * @return {*} Return the minimum value
 */
var min = function (nums) {
    if (nums.length) {
        return Math.min.apply(Math, nums);
    }
};
/**
 * Converts the first character of `string` to upper case
 * @param {String} str
 * @return {String} Return the converted string
 */
var upperFirst = function (str) { return "" + str.charAt(0).toUpperCase() + str.slice(1); };
export { camelToUpperSnake, capitalize, flatten, isEmpty, isNil, max, min, sortByProps, upperFirst };
//# sourceMappingURL=index.js.map