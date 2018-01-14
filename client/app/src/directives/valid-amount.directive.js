;(function () {
  'use strict'

  angular.module('arkclient.directives')
    .directive('validAmount', ['utilityService',
      function (utilityService) {
        return {
          require: 'ngModel',
          link: function (scope, elem, attrs, ctrl) {
            var val = function (value) {
              if (typeof value === 'undefined' || value === 0) {
                ctrl.$pristine = true
              }
              var num = Number(utilityService.arkToArktoshi(value, 0)) // 1.1 = 110000000
              var totalBalance = Number(utilityService.arkToArktoshi(scope.send.totalBalance))
              var remainingBalance = utilityService.arktoshiToArk(totalBalance - num, true)
              scope.send.remainingBalance = isNaN(remainingBalance) ? utilityService.arktoshiToArk(totalBalance, true) : remainingBalance

              if (typeof num === 'number' && num > 0) {
                if (num > Number.MAX_SAFE_INTEGER) {
                  ctrl.$setValidity('validAmount', false)
                } else {
                  ctrl.$setValidity('validAmount', true)
                }
              } else {
                ctrl.$setValidity('validAmount', false)
              }
              return value
            }
            ctrl.$parsers.unshift(val)
            ctrl.$formatters.unshift(val)
          }
        }
      }
    ])
})()
