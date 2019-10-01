export class Language {
  static get locale () {
    return 'en-US'
  }

  static get messages () {
    return require('../locales/en-US')
  }

  static get dateTimeFormats () {
    return {
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
    }
  }

  static get numberFormats () {
    return {
      currency: {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'symbol'
      }
    }
  }
}
