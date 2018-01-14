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
      controller: EmptyStateController,
      controllerAs: '$es'
    })

  function EmptyStateController ($scope) {
    this.$onInit = () => {
      this.imgSrc = this.imgSrc || 'assets/images/logo/white.png'
      this.header = this.header || 'No data found'
    }
  }
})()
