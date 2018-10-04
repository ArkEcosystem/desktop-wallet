import BigNumber from 'bignumber.js'
import { MARKET } from '@config'
import { merge } from 'lodash'

export default {
  methods: {
    /**
     * Returns the value formatted for a specific locale. It works with crypto
     * and fiat currencies.
     *
     * `vue-i18n` uses `NumberFormat` internally, so it doesn't admit nonexistent
     * currencies. For that reasond
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat | NumberFormat}
     * @see {@link https://www.currency-iso.org/en/home/tables/table-a1.html | List of currencies}
     *
     * @param {Number} value
     * @param {Object} options
     * @param {String} options.currency - The currency
     * @param {String} options.currencyFrom - To obtain the currency from the "session" or "network"
     * @param {String} [options.currencyDisplay = 'symbol']
     * @param {String} [options.locale = current locale]
     */
    currency_format (value, options = {}) {
      if (!options.currency && !options.currencyFrom) {
        throw new Error('Either the `currency` or the `currencyFrom` option is mandatory')
      }

      const defaultOptions = {
        currencyDisplay: 'symbol',
        locale: this.$i18n.locale
      }

      const mandatoryOptions = {
        style: 'currency'
      }

      if (options.currencyFrom === 'session') {
        options.currency = this.$store.getters['session/currency']
      }

      const config = merge({}, defaultOptions, options, mandatoryOptions)

      // `vue-i18n` uses `NumberFormat` internally, so it doesn't admit nonexistent
      // currencies. For that reason, we use the "no-currency" code instead and
      // replace it later with the cryptocurrency code or symbol
      const cryptoPlaceholder = 'XXX'
      let cryptoCurrency = null

      if (config.currencyFrom === 'network') {
        const network = this.session_network
        cryptoCurrency = config.currencyDisplay === 'symbol' ? network.symbol : network.token

        config.maximumFractionDigits = network.fractionDigits
        config.currency = cryptoPlaceholder
      } else if (MARKET.crypto.indexOf(config.currency) !== -1) {
        cryptoCurrency = config.currencyDisplay === 'symbol'
          ? MARKET.currencies[config.currency].symbol
          : config.currency

        config.maximumFractionDigits = MARKET.currencies[config.currency].fractionDigits
        config.currency = cryptoPlaceholder
      }

      const formattedValue = this.$n(value.toString(), config)
      return formattedValue.replace(cryptoPlaceholder, cryptoCurrency)
    },

    currency_subToUnit (value) {
      const { fractionDigits } = this.session_network
      return new BigNumber(value.toString()).dividedBy(Math.pow(10, fractionDigits)).toString()
    }
  }
}
