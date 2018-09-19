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
    'BTC': 'Ƀ',
    'ETH': 'Ξ',
    'LTC': 'Ł',
    'AUD': 'A$',
    'BRL': 'R$',
    'CAD': 'C$',
    'CHF': 'CHF',
    'CNY': '¥',
    'EUR': '€',
    'GBP': '£',
    'HKD': '£',
    'IDR': 'IDR',
    'INR': '₹',
    'JPY': '¥',
    'KRW': '₩',
    'MXN': 'MX$',
    'RUB': '₽',
    'USD': '$'
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
