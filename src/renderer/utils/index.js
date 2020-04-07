import sortByProps from './sort-by-props'

/**
 * Converts the first character of `string` to upper case
 * @param {String} str
 * @return {String} Return the converted string
 */
const upperFirst = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

/**
 * Converts the first character of `string` to upper case and the remaining to lower case
 * @param {String} str
 * @return {String} Return the capitalized string
 */
const capitalize = str => `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`

/**
 * Checks if `value` is `null` or `undefined`
 * @param {*} val
 * @return {Boolean} Return `true` if `value` is nullish, else `false`
 */
const isNil = val => val === null || val === undefined

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
 * Simple hack to validate deep nested objects without the actual optional chaining feature.
 *
 * @example
 * // This returns an array in case the reference fails.
 * optionalChaining(() => this.is.some.nested.object, [])
 *
 * @param {function} fn A function that imidiatly returns the object reference.
 * @returns {Object | any} The failsafe object or the value of that object.
 */
const optionalChaining = (fn, failsafe) => {
  try {
    return fn()
  } catch (err) {
    return failsafe
  }
}

export {
  upperFirst,
  capitalize,
  isNil,
  min,
  max,
  sortByProps,
  optionalChaining
}
