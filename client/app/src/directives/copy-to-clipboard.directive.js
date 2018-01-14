;(function () {
  'use strict'

  angular.module('arkclient.directives')
    .directive('copyToClipboard', ['toastService', '$window', function (toastService, $window) {
      var body = angular.element($window.document.body)
      var textarea = angular.element('<textarea/>')
      textarea.css({
        position: 'fixed',
        opacity: '0'
      })

      function copy (toCopy) {
        textarea.val(toCopy)
        body.append(textarea)
        textarea[0].select()

        try {
          var successful = document.execCommand('copy')
          if (!successful) throw successful
          else {
            toastService.success('Copied to clipboard', 3000)
          }
        } catch (err) {
          toastService.error('Failed to copy', 3000)
        }
        textarea.remove()
      }

      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.bind('click', function (e) {
            copy(attrs.copyToClipboard)
          })
        }
      }
    }])
})()
