(function() {
  'use strict';

  angular.module('arkclient.components').directive('qrScanner', ['$rootScope', '$timeout', '$mdDialog', 'toastService', qrScanner]);

  function qrScanner($rootScope, $timeout, $mdDialog, toastService) {

    function controller($scope) {

      $scope.hasWebcam = function() {
        navigator.mediaDevices.enumerateDevices()
          .then(function(MediaDeviceInfo) {
            MediaDeviceInfo.forEach(function(info) {
              if (info.kind == 'videoinput') return true;
            });
          })

        return false;
      }

      $scope.onSuccess = function(result) {
        if (typeof(result.type) !== 'undefined') {
          toastService.success(`The ${result.type} ${result.qr} has been successfully scanned.`);
        };

        $scope.$parent.send.data[$scope.inputCallback] = result.qr;

        $timeout(function() {
          $mdDialog.hide();
        }, 100);
      }

      $scope.onError = function(error) {
        toastService.error(error.error);

        $timeout(function() {
          $mdDialog.hide();
        }, 100);
      };

      $scope.onVideoError = function(error) {
        $scope.onError(error);
      }

      $scope.closeDialog = function() {
        $mdDialog.hide();
      };

      $scope.openScanner = function(evt) {
        $mdDialog.show({
          parent: angular.element(document.getElementById('app')),
          templateUrl: './src/components/qrScanner/qrScanner.html',
          clickOutsideToClose: false,
          targetEvent: evt,
          multiple: true,
          preserveScope: true,
          scope: $scope
        });
      }
    }

    return {
      restrict: 'E',
      scope: {
        onSuccess: "&",
        onError: "&",
        onVideoError: "&",
        inputCallback: "@"
      },
      controller: controller,
      replace: true,
      template: '<md-icon aria-label="Scan QR Code" style="cursor: pointer;outline: none" md-svg-icon="qrcode" ng-click="openScanner($event)" ng-disabled="hasWebcam()"></md-icon>'
    }

  }

})();
