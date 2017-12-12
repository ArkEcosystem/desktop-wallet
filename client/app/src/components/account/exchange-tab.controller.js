;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('exchangeTab', {
      templateUrl: 'src/components/account/templates/exchange-tab.html',
      bindings: {
        accountCtrl: '='
      },
      controller: ExchangeTabController
    })

  function ExchangeTabController ($scope) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
    }
  }
})()
