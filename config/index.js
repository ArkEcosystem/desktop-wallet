exports.NETWORKS = [
  require('./networks/devnet.json'),
  require('./networks/mainnet.json')
]

exports.ANNOUNCEMENTS = {
  rssUrl: 'https://blog.ark.io/feed'
}

exports.MARKET = {
  source: {
    baseUrl: 'https://min-api.cryptocompare.com'
  },
  currencies: [
    'BTC',
    'AUD',
    'BRL',
    'CAD',
    'CHF',
    'CNY',
    'EUR',
    'GBP',
    'HKD',
    'IDR',
    'INR',
    'JPY',
    'KRW',
    'MXN',
    'RUB',
    'USD'
  ]
}
