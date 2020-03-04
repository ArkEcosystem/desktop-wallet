import { dayjs } from '@/services/datetime'
import prettyBytes from 'pretty-bytes'

export default {
  methods: {
    formatter_bytes (value) {
      return prettyBytes(value)
    },

    formatter_percentage (value, minimumFractionDigits = 2, maximumFractionDigits = null) {
      const options = {
        minimumFractionDigits,
        ...(maximumFractionDigits && { maximumFractionDigits })
      }

      return `${this.$n(value, options)}%`
    },

    formatter_networkCurrency (value, digits) {
      return this.currency_format(this.currency_subToUnit(value), { currencyFrom: 'network', maximumFractionDigits: digits })
    },

    formatter_votes (value) {
      return this.$n(this.currency_subToUnit(value), { maximumFractionDigits: 2 })
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
      let userLanguage =
        (window.navigator.userLanguage || window.navigator.language).toLowerCase() || 'en'

      const [language, region] = userLanguage.split('-')

      if (
        (language === 'en' && region === 'us') ||
        language === region
      ) {
        userLanguage = language
      }

      try {
        require(`dayjs/locale/${userLanguage}`)
      } catch {
        userLanguage = 'en'
      }

      dayjs.locale(userLanguage)

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

      return dayjs(value).format(format)
    }
  }
}
