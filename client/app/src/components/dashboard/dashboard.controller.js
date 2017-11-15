;(function () {
  'use strict'

  angular
    .module('arkclient.components')
    .component('dashboard', {
      templateUrl: 'src/components/dashboard/templates/dashboard.html',
      bindings: {
        accountCtrl: '='
      },
      controller: ['$scope', '$mdToast', 'feedService', DashboardController]
    })

  function DashboardController ($scope, $mdToast, feedService) {

    this.$onInit = () => {
      // TODO already read + mark as read
      // TODO when moving to account view and come back
      // TODO translation

      feedService.fetchBlogEntries().then( entries => {
        const announcement = {
          date: entries[0].isoDate,
          text: entries[0].title,
          url: entries[0].link,
        }

        $mdToast.show({
          templateUrl: 'src/components/dashboard/templates/announcement.html',
          controller: 'AnnouncementController',
          locals: { announcement },
          position: 'bottom left',
          hideDelay: false
        })
      })
      // TODO errors
    }
  }

})()
