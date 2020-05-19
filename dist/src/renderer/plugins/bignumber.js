import BigNumberInstance from 'bignumber.js';
// Avoid scientific notation
// https://github.com/MikeMcl/bignumber.js/blob/master/bignumber.d.ts#L97
var BigNumber = BigNumberInstance.clone({ DECIMAL_PLACES: 8, EXPONENTIAL_AT: 1e+9 });
var NumberBuilder = /** @class */ (function () {
    /**
     * @param {Number|String|BigNumber} value
     */
    function NumberBuilder(value) {
        this.value = new BigNumber(value);
        this.decimalPlaces();
    }
    /**
     * The maximum number of decimal places
     * @param {Number} digits
     * @returns NumberBuilder
     */
    NumberBuilder.prototype.decimalPlaces = function (digits) {
        if (digits === void 0) { digits = 8; }
        this.fractionDigits = Math.pow(10, digits);
        this.value = this.value.decimalPlaces(digits, null);
        return this;
    };
    /**
     * Converts the number from satoshi to human
     * @returns NumberBuilder
     */
    NumberBuilder.prototype.toHuman = function () {
        this.value = this.value.dividedBy(this.fractionDigits);
        return this;
    };
    /**
     * Converts the number from human to satoshi
     * @returns NumberBuilder
     */
    NumberBuilder.prototype.toArktoshi = function () {
        this.value = this.value.multipliedBy(this.fractionDigits);
        return this;
    };
    /**
     * @param {Number|String|BigNumber} value
     * @returns NumberBuilder
     */
    NumberBuilder.prototype.add = function (value) {
        this.value = this.value.plus(value);
        return this;
    };
    /**
     * @param {Number|String|BigNumber} value
     * @returns NumberBuilder
     */
    NumberBuilder.prototype.subtract = function (value) {
        this.value = this.value.minus(value);
        return this;
    };
    /**
     * @param {Number|String|BigNumber} value
     * @returns NumberBuilder
     */
    NumberBuilder.prototype.multiply = function (value) {
        this.value = this.value.multipliedBy(value);
        return this;
    };
    /**
     * @param {Number|String|BigNumber} value
     * @returns Boolean
     */
    NumberBuilder.prototype.isEqualTo = function (value) {
        return this.value.eq(value);
    };
    /**
     * Returns the value as a string
     * @returns String
     */
    NumberBuilder.prototype.toString = function () {
        return this.value.toString();
    };
    return NumberBuilder;
}());
export { NumberBuilder };
export default BigNumber;
//# sourceMappingURL=bignumber.js.map