;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('marketService', ['$q', '$http', MarketService])

  function MarketService ($q, $http, networkService) {
    const baseUrl = 'https://min-api.cryptocompare.com'
    const tickerEndpoint = 'data/pricemultifull'
    const currencies = ['BTC', 'AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'KRW', 'MXN', 'RUB']

    const fetchTicker = (symbol) => {
      const deferred = $q.defer()
      const uri = `${baseUrl}/${tickerEndpoint}?fsyms=${symbol}&tsyms=${currencies.join(',')}`
      $http.get(uri)
        .then((response) => {
          const json = response['RAW'][symbol] || response['RAW'][symbol.toUpperCase()]
          if (!json) deferred.reject('Error')

          const currencies = generateRates(json)
          const result = { symbol, currencies }
          deferred.resolve(result)
        })
        .catch(err => deferred.reject(err))
      return deferred.promise
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

        rates.push({ [currency]: market })
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
      fetchTicker
    }
  }
})()
