;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('transactionTab', {
      templateUrl: 'src/components/account/templates/transaction-tab.html',
      bindings: {
        accountCtrl: '=',
        transactionsCtrl: '='
      },
      controller: TransactionTabController
    })

  function TransactionTabController ($scope) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
      this.transactionsCtrl = this.transactionsCtrl
    }
  }
})()
