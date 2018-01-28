;(function () {
  'use strict'

  angular
    .module('arkclient.components')
    .component('emptyState', {
      templateUrl: 'src/components/emptystate/empty-state.html',
      bindings: {
        imgSrc: '@?',
        header: '@?',
        content: '@?'
      },
      controller: ['gettextCatalog', EmptyStateController],
      controllerAs: '$es'
    })

  function EmptyStateController ($scope, gettextCatalog) {
    this.$onInit = () => {
      this.imgSrc = this.imgSrc || 'assets/images/logo/white.png'
      this.header = this.header || gettextCatalog.getString('No data found')
    }
  }
})()
