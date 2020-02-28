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
