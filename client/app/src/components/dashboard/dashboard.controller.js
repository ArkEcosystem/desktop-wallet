;(function () {
  'use strict'

  angular
    .module('arkclient.components')
    .component('dashboard', {
      templateUrl: 'src/components/dashboard/templates/dashboard.html',
      bindings: {
        accountCtrl: '='
      },
      controller: [
        '$scope', '$mdToast', 'toastService', 'feedService', 'storageService', DashboardController
      ]
    })

  function DashboardController ($scope, $mdToast, toastService, feedService, storageService) {

    this.$onInit = () => {
      setTimeout(()=> this.showAnnouncements(), 1000)
    }

    this.showAnnouncements = () => {
      return feedService.fetchBlogEntries()
        .then(entries => {
          const entry = entries[0]

          const stored = storageService.getGlobal('announcements')
          const last = stored ? stored.last : null

          if (!last || last.guid !== entry.guid && last.isoDate < entry.isoDate) {
            const announcement = {
              guid: entry.guid,
              date: entry.isoDate,
              text: entry.title,
              url: entry.link
            }

            $mdToast.show({
              templateUrl: 'src/components/dashboard/templates/announcement.html',
              parent: angular.element(document.getElementById('dashboard')),
              controller: 'AnnouncementController',
              locals: { announcement },
              position: 'bottom left',
              hideDelay: false
            })
          }
        })
        .catch(_ => toastService.error('Error loading the announcements.', 3000))
    }

    this.openExternal = url => {
      require('electron').shell.openExternal(url)
    }
  }

})()
