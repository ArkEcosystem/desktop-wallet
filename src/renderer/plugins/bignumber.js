import BigNumber from 'bignumber.js'

// Avoid scientific notation
// https://github.com/MikeMcl/bignumber.js/blob/master/bignumber.d.ts#L97
BigNumber.config({ DECIMAL_PLACES: 8, EXPONENTIAL_AT: 1e+9 })

export class NumberBuilder {
  /**
   * @param {Number|String|BigNumber} value
   */
  constructor (value) {
    this.value = new BigNumber(value)
    this.decimalPlaces()
  }

  /**
   * The maximum number of decimal places
   * @param {Number} digits
   * @returns NumberBuilder
   */
  decimalPlaces (digits = 8) {
    this.fractionDigits = Math.pow(10, digits)
    this.value = this.value.decimalPlaces(digits, null)
    return this
  }

  /**
   * Converts the number from satoshi to human
   * @returns NumberBuilder
   */
  toHuman () {
    this.value = this.value.dividedBy(this.fractionDigits)
    return this
  }

  /**
   * Converts the number from human to satoshi
   * @returns NumberBuilder
   */
  toArktoshi () {
    this.value = this.value.multipliedBy(this.fractionDigits)
    return this
  }

  /**
   * @param {Number|String|BigNumber} value
   * @returns NumberBuilder
   */
  add (value) {
    this.value = this.value.plus(value)
    return this
  }

  /**
   * @param {Number|String|BigNumber} value
   * @returns NumberBuilder
   */
  subtract (value) {
    this.value = this.value.minus(value)
    return this
  }

  /**
   * @param {Number|String|BigNumber} value
   * @returns NumberBuilder
   */
  multiply (value) {
    this.value = this.multipliedBy(value)
    return this
  }

  /**
   * Returns the value as a string
   * @returns String
   */
  toString () {
    return this.value.toString()
  }
}

export default BigNumber
