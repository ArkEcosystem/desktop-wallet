;(function () {
  'use strict'

  /**
   * This controller manages the content and action of the announcement toast
   * (triggered during the dashboard initialization).
   *
   * NOTE: if there is a notification this announcement will be dismissed
   */

  angular
    .module('arkclient.components')
    .controller('AnnouncementController', ['$scope', '$mdToast', 'locals', AnnouncementController])

  function AnnouncementController ($scope, $mdToast, locals) {
    $scope.announcement = locals.announcement

    $scope.dismiss = () => {
      $mdToast.hide()
    }

    $scope.openExternal = url => {
      require('electron').shell.openExternal(url)
    }
  }

})()
