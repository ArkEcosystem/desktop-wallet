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

    return {
      open,
      hide
    }
  }
})()
