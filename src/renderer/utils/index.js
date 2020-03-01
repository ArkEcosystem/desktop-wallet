/**
 * Converts the first character of `string` to upper case
 * @param {String} str
 * @return {String} Return the converted string
 */
export const upperFirst = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

/**
 * Converts the first character of `string` to upper case and the remaining to lower case
 * @param {String} str
 * @return {String} Return the capitalized string
 */
export const capitalize = str => `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`

/**
 * Checks if `value` is `null` or `undefined`
 * @param {*} val
 * @return {Boolean} Return `true` if `value` is nullish, else `false`
 */
export const isNil = val => val === null || val === undefined

/**
 * Computes the minimum value of `array`
 * @param {Array} nums
 * @return {*} Return the minimum value
 */
export const min = nums => {
  if (nums.length) {
    return Math.min(...nums)
  }
}

/**
 * Computes the maximum value of `array`
 * @param {Array} nums
 * @return {*} Return the maximum value
 */
export const max = nums => {
  if (nums.length) {
    return Math.max(...nums)
  }
}
