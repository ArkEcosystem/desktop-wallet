(function() {
  'use strict';

  angular.module('arkclient.directives')
    .directive('copyToClipboard', function($window, $mdToast) {
      var body = angular.element($window.document.body);
      var textarea = angular.element('<textarea/>');
      textarea.css({
        position: 'fixed',
        opacity: '0'
      });

      function copy(toCopy) {
        textarea.val(toCopy);
        body.append(textarea);
        textarea[0].select();

        try {
          var successful = document.execCommand('copy');
          if (!successful) throw successful;
        } catch (err) {
          console.log("failed to copy", toCopy);
        }
        $mdToast.simple()
          .textContent('Text copied to clipboard!')
          .hideDelay(2000);
        textarea.remove();
      }

      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          element.bind('click', function(e) {
            copy(attrs.copyToClipboard);
          });
        }
      }
    });
  
})();
  