;(function () {
  'use strict'

  angular.module('arkclient.components').directive('qrScanner', ['$rootScope', '$timeout', '$mdDialog', 'toastService', 'gettextCatalog', qrScanner])

  function qrScanner ($rootScope, $timeout, $mdDialog, toastService, gettextCatalog) {
    function controller ($scope) {
      const checkWebcam = () => {
        navigator.mediaDevices.enumerateDevices()
          .then((MediaDeviceInfo) => {
            return MediaDeviceInfo.some(info => info.kind === 'videoinput')
          })

        return false
      }

      $scope.hasWebcam = checkWebcam()

      $scope.onSuccess = function (result) {
        if (typeof (result.type) !== 'undefined') {
          toastService.success(gettextCatalog.getString('The {{ qrCodeType }} {{ qrCode }} has been successfully scanned.',
                                                        { qrCodeType: result.type, qrCode: result.qr }))
        }

        if ($scope.inputCallback) {
          $scope.$parent.send.data[$scope.inputCallback] = result.qr
        }

        if ($scope.inputCallbackFunc) {
          $scope.inputCallbackFunc({ qr: result.qr })
        }

        $timeout(() => {
          $mdDialog.hide()
        }, 100)
      }

      $scope.onError = function (error) {
        toastService.error(error.error)

        $timeout(() => {
          $mdDialog.hide()
        }, 100)
      }

      $scope.onVideoError = function (error) {
        $scope.onError(error)
      }

      $scope.closeDialog = function () {
        $mdDialog.hide()
      }

      $scope.openScanner = function (evt) {
        $mdDialog.show({
          parent: angular.element(document.getElementById('app')),
          templateUrl: './src/components/qr-scanner/qr-scanner.html',
          clickOutsideToClose: false,
          targetEvent: evt,
          multiple: true,
          preserveScope: true,
          scope: $scope
        })
      }
    }

    return {
      restrict: 'E',
      scope: {
        onSuccess: '&',
        onError: '&',
        onVideoError: '&',
        inputCallback: '@',
        inputCallbackFunc: '&'
      },
      controller: controller,
      replace: true,
      template: '<md-icon aria-label="Scan QR Code" style="cursor: pointer;outline: none" md-svg-icon="qrcode" ng-click="openScanner($event)" ng-disabled="hasWebcam"></md-icon>'
    }
  }
})()
