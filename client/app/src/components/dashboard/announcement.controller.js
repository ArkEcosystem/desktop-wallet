;(function () {
  'use strict'

  /**
   * This controller manages the content and action of the announcement toast
   * that is shown on the dashboard.
   *
   * NOTE: if there is a new notification this announcement will be hidden
   */

  angular
    .module('arkclient.components')
    .controller('AnnouncementController', [
      '$scope', '$mdToast', 'locals', 'storageService', AnnouncementController
    ])

  function AnnouncementController ($scope, $mdToast, locals, storageService) {
    $scope.announcement = locals.announcement

    /**
     * Close the toast and store the new last announcement that the user has
     * read, or at least, dismissed
     */
    $scope.dismiss = () => {
      $mdToast.hide()

      storageService.setGlobal('announcements', {
        last: {
          guid: locals.announcement.guid,
          isoDate: locals.announcement.date
        }
      })
    }

    $scope.openAnnouncement = url => {
      require('electron').shell.openExternal(url)
      setTimeout(() => $scope.dismiss(), 2000)
    }
  }
})()
