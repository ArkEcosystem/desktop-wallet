;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('marketBox', {
      templateUrl: 'src/components/dashboard/market-box.html',
      bindings: {
        accountCtrl: '='
      },
      controller: MarketController
    })

  function MarketController (marketService, $scope) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
    }
  }
})()
