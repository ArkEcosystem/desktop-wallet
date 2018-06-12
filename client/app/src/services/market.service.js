;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('marketService', ['$q', '$http', '$timeout', 'storageService', 'networkService', MarketService])

  function MarketService ($q, $http, $timeout, storageService, networkService) {
    const baseUrl = 'https://min-api.cryptocompare.com'
    const tickerEndpoint = 'data/pricemultifull'
    const currencies = ['BTC', 'AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'KRW', 'MXN', 'RUB']
    const storageKey = 'marketTicker'
    const network = networkService.getNetwork()
    const symbol = network.cmcTicker || 'ARK'

    const init = () => {
      $timeout(() => updateTicker(), 6 * 10000)
    }

    const saveTicker = (ticker) => {
      const symbol = ticker.symbol
      const currentMarket = getMarketTicker()

      currentMarket[symbol] = ticker

      storageService.set(storageKey, currentMarket)

      return currentMarket
    }

    const getMarketTicker = () => {
      return storageService.get(storageKey) || {}
    }

    const getPrice = (currency = 'BTC') => {
      if (!network.cmcTicker && network.token !== 'ARK') getEmptyMarket()

      const storage = storageService.get(storageKey)
      const market = storage[symbol]

      if (!market) return getEmptyMarket()
      const currencies = market.currencies

      return currencies[currency.toUpperCase()]
    }

    const fetchTicker = () => {
      const deferred = $q.defer()
      const uri = `${baseUrl}/${tickerEndpoint}?fsyms=${symbol}&tsyms=${currencies.join(',')}`
      $http.get(uri)
        .then(({ data }) => {
          const json = data['RAW'][symbol] || data['RAW'][symbol.toUpperCase()]
          if (!json) deferred.reject('Failed to find market price.')

          const currencies = generateRates(json)
          const timestamp = Date.now()
          const result = { symbol, currencies, timestamp }
          deferred.resolve(result)
        })
        .catch(err => deferred.reject(err))
      return deferred.promise
    }

    const updateTicker = async () => {
      const ticker = await fetchTicker(symbol)
      return saveTicker(ticker)
    }

    const generateRates = (response) => {
      const rates = {}

      for (const currency of currencies) {
        const market = getEmptyMarket()

        if (response[currency]) {
          market.price = response[currency].PRICE
          market.marketCap = response[currency].MKTCAP
          market.volume = response[currency].TOTALVOLUME24HTO
          market.timestamp = response[currency].LASTUPDATE
          market.change24h = response[currency].CHANGEPCT24HOUR || null
        }

        rates[currency] = market
      }

      return rates
    }

    const getEmptyMarket = () => {
      return {
        price: 0.0,
        marketCap: 0.0,
        volume: 0.0,
        timestamp: 0,
        change24h: 0
      }
    }

    return {
      init,
      getPrice,
      getMarketTicker,
      fetchTicker,
      updateTicker
    }
  }
})()
