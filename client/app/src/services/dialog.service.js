;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('dialogService', ['$mdDialog', DialogService])

  /**
   * DialogService
   * @constructor
   *
   * A very simple service the
   */
  function DialogService ($mdDialog) {
    const open = ({ scope, templateUrl }) => {
      $mdDialog.show({
        scope,
        templateUrl,
        preserveScope: true,
        clickOutsideToClose: false,
        parent: angular.element(document.getElementById('app'))
      })
    }
    const hide = () => $mdDialog.hide()

    const openLoadingDialog = (theme, title, text) => {
      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/components/loading-dialog/loadingDialog.html',
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true,
        locals: {
          title: title,
          text: text,
          theme: theme
        },
        controller: ['$scope', 'title', 'text', 'theme', ($scope, title, text, theme) => {
          $scope.title = title
          $scope.text = text
          $scope.theme = theme
        }]
      })
    }

    return {
      open,
      hide,
      openLoadingDialog
    }
  }
})()
