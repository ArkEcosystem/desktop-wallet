;(function () {
  'use strict'

  angular.module('arkclient.filters')
    .filter('smallId', function () {
      return function (fullId) {
        return fullId.slice(0, 5) + '...' + fullId.slice(-5)
      }
    })
    .filter('exchangedate', function () {
      return function (exchangetime) {
        return new Date(exchangetime * 1000)
      }
    })
    .filter('amountToCurrency', function () {
      return function (amount, scope, bitcoinToggleIsActive) {
        if (typeof amount === 'undefined' || !amount) return 0
        // NOTE AccountController is being renaming to `ac` in refactored templates
        const ac = scope.ac || scope.ul
        const currencyName = bitcoinToggleIsActive && ac.btcValueActive ? 'btc' : ac.currency.name
        const price = ac.connectedPeer.market.price[currencyName]
        return (amount * price).toFixed(5)
      }
    }).filter('formatCurrency', function () {
      return function (val, self, bitcoinToggleIsActive) {
        var currencyName = bitcoinToggleIsActive && self.btcValueActive ? 'btc' : self.currency.name
        var languageCode = self.language.replace('_', '-')
        var options = {
          style: 'currency',
          currency: currencyName,
          currencyDisplay: 'symbol'
        }

        var localeVersion

        if (currencyName === 'btc') {
          let value = String(val).length > 8 ? Number(val).toFixed(8) : val
          localeVersion = 'Ƀ ' + Number(value)
        } else {
          localeVersion = Number(val).toLocaleString(languageCode, options)
        }

        return localeVersion
      }
    })
})()
