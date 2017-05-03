(function(){
  'use strict';

  angular.module('arkclient').directive('validAmount', [
    function() {
      return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {

          var val = function(value) {
            if (typeof value == 'undefined' || value == 0) {
              ctrl.$pristine = true;
            }

            var num = Number((value * 100000000).toFixed(0)); // 1.1 = 110000000

            if (typeof num == "number" && num > 0) {
              if (num > Number.MAX_SAFE_INTEGER) {
                ctrl.$setValidity('validAmount', false);
              } else {
                var decimal = 8;
                var index = ('' + value).indexOf('.'); // for check len digits after dot
                var sufix = ('' + value).substring(index + 1);

                if (index >= 0 && sufix.length > decimal) {
                  ctrl.$setValidity('validAmount', false);
                  return;
                } else {
                  ctrl.$setValidity('validAmount', true);
                }
              }
            } else {
              ctrl.$setValidity('validAmount', false)
            }
            return value;
          }
          ctrl.$parsers.unshift(val);
          ctrl.$formatters.unshift(val);
        }
      }
    }
  ]);

})();
