import sortByProps from './sort-by-props'

/**
 * Converts camelCaseString to UPPER_CAMEL_CASE_STRING
 * @param {String} String the camelCaseString
 * @returns {String} The UPPER_CAMEL_CASE
 */
const camelToUpperSnake = string => string.split(/(?=[A-Z])/).join('_').toUpperCase()

/**
 * Converts the first character of `string` to upper case and the remaining to lower case
 * @param {String} str
 * @return {String} Return the capitalized string
 */
const capitalize = str => `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`

/**
 * Flattens `array` a single level deep
 * @param {Array} arr
 * @return {Array} Return the new flattened array
 */
const flatten = arr => arr.reduce((a, b) => a.concat(b), [])

/**
 * Checks if `value` is an empty object, collection, map, or set
 * @param {*} val
 * @return {Boolean} Return `true` if `value` is empty, else `false`
 */
const isEmpty = val => [Object, Array].includes((val || {}).constructor) && !Object.entries((val || {})).length

/**
 * Checks if `value` is `null` or `undefined`
 * @param {*} val
 * @return {Boolean} Return `true` if `value` is nullish, else `false`
 */
const isNil = val => val === null || val === undefined

/**
 * Computes the maximum value of `array`
 * @param {Array} nums
 * @return {*} Return the maximum value
 */
const max = nums => {
  if (nums.length) {
    return Math.max(...nums)
  }
}

/**
 * Computes the minimum value of `array`
 * @param {Array} nums
 * @return {*} Return the minimum value
 */
const min = nums => {
  if (nums.length) {
    return Math.min(...nums)
  }
}

/**
 * Converts the first character of `string` to upper case
 * @param {String} str
 * @return {String} Return the converted string
 */
const upperFirst = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

export {
  camelToUpperSnake,
  capitalize,
  flatten,
  isEmpty,
  isNil,
  max,
  min,
  sortByProps,
  upperFirst
}
