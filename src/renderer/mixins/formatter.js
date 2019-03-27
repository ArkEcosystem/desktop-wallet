import moment from 'moment'

export default {
  methods: {
    formatter_percentage (value) {
      return `${this.$n(value, { minimumFractionDigits: 2 })}%`
    },

    formatter_networkCurrency (value, digits) {
      return this.currency_format(this.currency_subToUnit(value), {
        currencyFrom: 'network',
        maximumFractionDigits: digits
      })
    },

    formatter_votes (value) {
      return this.$n(this.currency_subToUnit(value), {
        maximumFractionDigits: 2
      })
    },

    /**
     * Formats a date:
     *  - Default  => L LTS
     *  - 12h      => L h:mm:ss
     *  - 24h      => L HH:mm:ss
     * @param {Date}
     * @param {String} [format] - The specific format to use. If not provided, uses the session setting `timeFormat`
     * @return {String}
     */
    formatter_date (value, format = null) {
      moment.locale(window.navigator.userLanguage || window.navigator.language)

      if (!format) {
        const sessionFormat = this.session_profile.timeFormat
        if (sessionFormat === '12h') {
          format = 'L h:mm:ss A'
        } else if (sessionFormat === '24h') {
          format = 'L HH:mm:ss'
        } else {
          format = 'L LTS'
        }
      }
      return moment(value).format(format)
    }
  }
}
