;(function () {
  'use strict'

  /*
   * Opens a link in a new browser tab
   */
  angular.module('arkclient.directives')
    .directive('openExternal', [function () {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ctrl) {
          angular.element(element).bind('click', function (event) {
            const url = scope.$eval(attrs.openExternal)
            require('electron').shell.openExternal(url)
          })
        }
      }
    }])
})()
