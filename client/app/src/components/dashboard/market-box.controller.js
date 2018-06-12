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
      const updateMarket = () => {
        const currencyName = this.accountCtrl.btcValueActive ? 'btc' : this.accountCtrl.currency.name
        this.market = marketService.getPrice(currencyName)
      }

      $scope.$watch(() => this.accountCtrl.currency, updateMarket)

      this.ul = this.accountCtrl
    }
  }
})()
