module.exports = {
  notice: {
    logFile: false,
    level: 1,
    defaultHideDelay: 5000
  },
  networks : {
		mainnet: { // so far same as testnet
		  nethash: '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988',
		  peerseed: 'http://5.39.9.240:4001',
		  forcepeer: false,
		  token: 'ARK',
		  symbol: 'Ѧ',
		  version: 0x17,
		  slip44: 111,
		  explorer: 'https://explorer.ark.io',
		  background: 'url(assets/images/images/Ark.jpg)',
		  theme: 'default',
		  themeDark: false
		},
		devnet: {
		  nethash: '578e820911f24e039733b45e4882b73e301f813a0d2c31330dafda84534ffa23',
		  peerseed: 'http://167.114.29.55:4002',
		  token: 'DARK',
		  symbol: 'DѦ',
		  version: 30,
		  slip44: 1, // all coin testnet
		  explorer: 'http://dexplorer.ark.io',
		  background: '#222299',
		  theme: 'default',
		  themeDark: false
		},
		 blockpoolnet: {
		  nethash: '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988',
		  peerseed: 'http://13.56.163.57:9030',
		  token: 'BLOCKPOOL',
		  symbol: 'β',
		  version: 25,
		  slip44: 1, // all coin testnet
		  explorer: 'http://13.56.163.57:9031',
		  background: '#C62D7D',
		  theme: 'default',
		  themeDark: false
		},
		  kapunet: {
		  nethash: '313ea34c8eb705f79e7bc298b788417ff3f7116c9596f5c9875e769ee2f4ede1',
		  peerseed: 'http://108.61.167.107:9700',
		  token: 'KAPU',
		  symbol: 'ʞ',
		  version: 45,
		  slip44: 1, // all coin testnet
		  explorer: 'http://explorer.kapu.one',
		  background: '#162D7D',
		  theme: 'default',
		  themeDark: false
		}
	}
}

