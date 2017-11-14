;(function () {
  'use strict'

  angular
    .module('arkclient.components')
    .component('announcement', {
      templateUrl: 'src/components/dashboard/templates/announcement.html',
      controller: ['$scope', 'feedService', AnnouncementController]
    })

  // TODO animation

  function AnnouncementController ($scope, feedService) {
    this.$onInit = () => {
      feedService.fetchBlogEntries().then( entries => {
        $scope.announcement = {
          date: entries[0].isoDate,
          text: entries[0].title,
          url: entries[0].link,
        }
      })
      // TODO errors
    }

    $scope.openExternal = url => {
      require('electron').shell.openExternal(url)
    }

    $scope.dismiss = () => {
      $scope.showFeed = false
    }
  }

})()
