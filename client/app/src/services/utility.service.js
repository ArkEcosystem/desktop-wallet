;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('utilityService', ['ARKTOSHI_UNIT', UtilityService])

  // this service should not have any dependencies to other services!
  function UtilityService (ARKTOSHI_UNIT) {
    function arktoshiToArk (amount, keepPrecise, numberOfDecimals) {
      if (!amount) {
        return 0
      }

      let ark = amount / ARKTOSHI_UNIT

      if (!keepPrecise) {
        ark = numberToFixed(ark)
      }

      if (typeof numberOfDecimals !== 'number') {
        return ark
      }

      if (typeof ark === 'number') {
        return ark.toFixed(numberOfDecimals)
      }

      // if we have a string, 'toFixed' won't work, so we use our custom implementation for that
      return numberStringToFixed(ark, numberOfDecimals)
    }

    function arkToArktoshi (amount, numberOfDecimals) {
      if (!amount) {
        return 0
      }

      const ark = amount * ARKTOSHI_UNIT
      return typeof numberOfDecimals !== 'number' ? ark : ark.toFixed(numberOfDecimals)
    }

    function numberStringToFixed (ark, numberOfDecimals) {
      if (typeof ark !== 'string' || typeof numberOfDecimals === 'undefined') {
        return ark
      }

      const splitted = ark.split('.')

      if (numberOfDecimals === 0) {
        return splitted[0]
      }

      const decimals = splitted[1] || []
      let newDecimals = ''
      for (let i = 0; i < numberOfDecimals; i++) {
        if (i < decimals.length) {
          newDecimals += decimals[i]
        } else {
          newDecimals += '0'
        }
      }

      return splitted[0] + '.' + newDecimals
    }

    function numberToFixed (x) {
      let e
      if (Math.abs(x) < 1.0) {
        e = parseInt(x.toString().split('e-')[1])
        if (e) {
          x *= Math.pow(10, e - 1)
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2)
        }
      } else {
        e = parseInt(x.toString().split('+')[1])
        if (e > 20) {
          e -= 20
          x /= Math.pow(10, e)
          x += (new Array(e + 1)).join('0')
        }
      }
      return x
    }

    return {
      arktoshiToArk: arktoshiToArk,
      arkToArktoshi: arkToArktoshi,
      numberStringToFixed: numberStringToFixed
    }
  }
})()
