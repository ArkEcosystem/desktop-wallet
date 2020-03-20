export default {
  locale: 'en-US',

  messages: require('../locales/en-US').default,

  dateTimeFormats: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    },
    shortTime: {
      hour: 'numeric',
      minute: 'numeric'
    }
  },

  numberFormats: {
    currency: {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol'
    }
  }
}
