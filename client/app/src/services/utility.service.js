;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('utilityService', ['networkService', 'ARKTOSHI_UNIT', UtilityService])

  function UtilityService (networkService, ARKTOSHI_UNIT) {
    function arktoshiToArk (amount, keepPrecise, appendTokenName) {
      if (!amount) {
        return 0
      }

      let ark = amount / ARKTOSHI_UNIT

      if (!keepPrecise) {
        ark = numberToFixed(ark)
      }

      if (appendTokenName) {
        return ark + ' ' + networkService.getNetwork().token
      }

      return ark
    }

    function numberToFixed (x) {
      var e
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
      arktoshiToArk: arktoshiToArk
    }
  }
})()
