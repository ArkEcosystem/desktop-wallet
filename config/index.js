exports.NETWORKS = [
  require('./networks/mainnet.json'),
  require('./networks/devnet.json')
]

exports.ANNOUNCEMENTS = {
  rssUrl: 'https://blog.ark.io/feed'
}

exports.I18N = {
  defaultLocale: 'en-US',
  enabledLocales: [
    'en-US',
    'es-ES',
    'pt-BR'
  ]
}

exports.INTERVALS = {
  'short': 30000, // 30 seconds
  'medium': 60000, // 1 minute
  'long': 180000 // 3 minute
}

exports.MARKET = {
  source: {
    baseUrl: 'https://min-api.cryptocompare.com'
  },
  defaultCurrency: 'USD',
  crypto: [
    'BTC',
    'ETH',
    'LTC'
  ],
  currencies: {
    BTC: { symbol: 'Ƀ', fractionDigits: 8 },
    ETH: { symbol: 'Ξ', fractionDigits: 8 },
    LTC: { symbol: 'Ł', fractionDigits: 8 },
    AUD: { symbol: 'A$', fractionDigits: 2 },
    BRL: { symbol: 'R$', fractionDigits: 2 },
    CAD: { symbol: 'C$', fractionDigits: 2 },
    CHF: { symbol: 'CHF', fractionDigits: 2 },
    CNY: { symbol: '¥', fractionDigits: 2 },
    EUR: { symbol: '€', fractionDigits: 2 },
    GBP: { symbol: '£', fractionDigits: 2 },
    HKD: { symbol: '£', fractionDigits: 2 },
    IDR: { symbol: 'IDR', fractionDigits: 2 },
    INR: { symbol: '₹', fractionDigits: 2 },
    JPY: { symbol: '¥', fractionDigits: 0 },
    KRW: { symbol: '₩', fractionDigits: 0 },
    MXN: { symbol: 'MX$', fractionDigits: 2 },
    RUB: { symbol: '₽', fractionDigits: 2 },
    USD: { symbol: '$', fractionDigits: 2 }
  }
}

exports.THEMES = [
  {
    id: 'light',
    title: 'Light theme' // TODO translate
  },
  {
    id: 'dark',
    title: 'Dark theme' // TODO translate
  }
]
