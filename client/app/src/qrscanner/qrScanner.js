(function(){
  'use strict';

  angular.module('arkclient').directive('qrScanner', ['$rootScope', '$timeout', '$mdDialog', '$mdToast', qrScanner]);

  function qrScanner($rootScope, $timeout, $mdDialog, $mdToast) {

    function controller ($scope) {

      $scope.hasWebcam = function()
      {
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
          $mdToast.show(
            $mdToast.simple()
                  .textContent(`The ${result.type} ${result.qr} has been successfully scanned.`)
                  .hideDelay(5000)
          );
        };

        $scope.$parent.send.data[$scope.inputCallback] = result.qr;

        $timeout(function () {
          $mdDialog.hide();
        }, 100);
      }

      $scope.onError = function(error) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(error.error)
            .hideDelay(5000)
            .theme('error')
        );

        $timeout(function () {
          $mdDialog.hide();
        }, 100);
      };

      $scope.onVideoError = function(error) {
        $scope.onError(error);
      }

      $scope.closeDialog = function () {
        $mdDialog.hide();
      };

      $scope.openScanner = function (evt) {
        $mdDialog.show({
          parent             : angular.element(document.getElementById('app')),
          templateUrl        : './src/qrscanner/scanner.html',
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
      template: '<button class="md-button md-primary" ng-click="openScanner($event)" ng-disabled="hasWebcam()">QR Code</md-button>'
    }

  }

})();