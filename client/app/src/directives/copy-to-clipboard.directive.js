;(function () {
  'use strict'

  angular.module('arkclient.directives')
    .directive('copyToClipboard', ['toastService', 'gettext', '$window', function (toastService, gettext, $window) {
      const body = angular.element($window.document.body)
      const textarea = angular.element('<textarea/>')
      textarea.css({
        position: 'fixed',
        opacity: '0'
      })

      function copy (toCopy) {
        textarea.val(toCopy)
        body.append(textarea)
        textarea[0].select()

        try {
          const successful = document.execCommand('copy')
          if (!successful) throw successful
          else {
            toastService.success(gettext('Copied to clipboard'), 3000)
          }
        } catch (err) {
          toastService.error(gettext('Failed to copy'), 3000)
        }
        textarea.remove()
      }

      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.bind('click', (e) => {
            copy(attrs.copyToClipboard)
          })
        }
      }
    }])
})()
