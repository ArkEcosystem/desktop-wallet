;(function () {
  'use strict'

  angular.module('arkclient.filters')
    .filter('smallId', function () {
      return function (fullId) {
        return smallId(fullId)
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

        if (!ac.connectedPeer.market.price) {
          return 0
        }

        const price = ac.connectedPeer.market.price[currencyName]
        return (amount * price).toFixed(5)
      }
    })
    .filter('formatCurrency', function () {
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
  // converts arktoshi into ark
  .filter('convertToArkValue', ['ARKTOSHI_UNIT', function (ARKTOSHI_UNIT) {
    return function (val) {
      return val / ARKTOSHI_UNIT
    }
  }])
  .filter('accountlabel', ['accountService', function (accountService) {
    return function (address) {
      if (!address) return address

      var username = accountService.getUsername(address)
      if (username.match(/^[AaDd]{1}[0-9a-zA-Z]{33}$/g)) return smallId(username)

      return username
    }
  }])

  function smallId (fullId) {
    return fullId.slice(0, 5) + '...' + fullId.slice(-5)
  }
})()
