(function() {
  'use strict';

  angular.module('arkclient.coreUtils')
    .directive('validAmount', [
      function() {
        return {
          require: 'ngModel',
          link: function(scope, elem, attrs, ctrl) {

            const val = function (value) {
              if (typeof value == 'undefined' || value == 0) {
                ctrl.$pristine = true;
              }

              const satoshis = 100000000;
              let num = Number((value * satoshis).toFixed(0)); // 1.1 = 110000000
              const totalBalance = Number(scope.send.totalBalance * satoshis);
              const remainingBalance = ((totalBalance - num) / satoshis);
              scope.send.remainingBalance = isNaN(remainingBalance) ? totalBalance / satoshis : remainingBalance;

              if (typeof num == "number" && num > 0) {
                if (num > Number.MAX_SAFE_INTEGER) {
                  ctrl.$setValidity('validAmount', false);
                } else {
                  ctrl.$setValidity('validAmount', true);
                }
              } else {
                ctrl.$setValidity('validAmount', false);
              }
              return value;
            };
            ctrl.$parsers.unshift(val);
            ctrl.$formatters.unshift(val);
          }
        }
      }
    ]);

})();
