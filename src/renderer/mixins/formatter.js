import moment from 'moment'

export default {
  methods: {
    formatter_percentage (value) {
      return `${this.$n(value, { minimumFractionDigits: 2 })}%`
    },

    formatter_networkCurrency (value, digits) {
      return this.currency_format(this.currency_subToUnit(value), { currencyFrom: 'network', maximumFractionDigits: digits })
    },

    formatter_votes (value) {
      return this.$n(this.currency_subToUnit(value), { maximumFractionDigits: 2 })
    },

    formatter_date (value, format) {
      moment.locale(window.navigator.userLanguage || window.navigator.language)
      // Simply return based on format if one is specified
      if (format) {
        return moment(value).format(format)
      }

      // Default = L LTS, 12h = L h:mm:ss, 24h = L HH:mm:ss
      let defaultFormat = 'L LTS'
      const timeFormat = this.session_profile.timeFormat
      console.log(timeFormat)
      if (timeFormat === '12h') {
        defaultFormat = 'L h:mm:ss A'
      } else if (timeFormat === '24h') {
        defaultFormat = 'L HH:mm:ss'
      }
      return moment(value).format(defaultFormat)
    }
  }
}
