/**
 * Converts the first character of `string` to upper case.
 * @param {String} str
 * @return {String} Returns the converted string.
 */
export const upperFirst = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

/**
 * Converts the first character of `string` to upper case and the remaining to lower case.
 * @param {String} str
 * @return {String} Returns the capitalized string.
 */
export const capitalize = str => `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`

/**
 * Checks if `value` is `null` or `undefined`.
 * @param {*} val
 * @return {Boolean} Returns `true` if `value` is nullish, else `false`.
 */
export const isNil = val => val == null
