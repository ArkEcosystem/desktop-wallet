;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('offchainTab', {
      templateUrl: 'src/components/account/offchain-tab.html',
      bindings: {
        accountCtrl: '='
      },
      controller: OffchainTabController
    })

  function OffchainTabController ($scope) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
    }
  }

})()
