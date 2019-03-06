exports.APP = {
  website: 'https://ark.io',
  transactionExpiryMinutes: 45
}

exports.NETWORKS = [
  require('./networks/mainnet.json'),
  require('./networks/devnet.json')
]

exports.PEERS = {
  'ark.mainnet': require('./peers/mainnet.json'),
  'ark.devnet': require('./peers/devnet.json')
}

exports.ANNOUNCEMENTS = {
  rssUrl: 'https://blog.ark.io/feed'
}

exports.VENDOR_FIELD = {
  defaultMaxLength: 64
}

exports.I18N = {
  defaultLocale: 'en-US',
  enabledLocales: [
    'en-US'
  ]
}

exports.BIP39 = {
  defaultLanguage: 'english',
  languages: [
    'chinese_simplified',
    'chinese_traditional',
    'english',
    'french',
    'italian',
    'japanese',
    'korean',
    'spanish'
  ]
}

exports.TRANSACTION_TYPES = {
  TRANSFER: 0,
  SECOND_SIGNATURE: 1,
  DELEGATE_REGISTRATION: 2,
  VOTE: 3,
  MULTI_SIGNATURE: 4,
  IPFS: 5,
  TIMELOCK_TRANSFER: 6,
  MULTI_PAYMENT: 7,
  DELEGATE_RESIGNATION: 8
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
  defaultCurrency: 'BTC',
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
    HKD: { symbol: 'HK$', fractionDigits: 2 },
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

exports.V1 = {
  fees: [
    0.1 * 1e8, // Transfer
    5 * 1e8, // Second signautre
    25 * 1e8, // Delegate registration
    1 * 1e8, // Vote
    5 * 1e8, // Multisignature
    0 * 1e8, // IPFS (not supported yet)
    0 * 1e8, // Timelock transfer (not supported yet)
    0 * 1e8, // Multu-payment (not supported yet)
    0 * 1e8 // Delegate resignation (not supported yet)
  ]
}
