;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('sendTransaction', {
      templateUrl: 'src/accounts/view/sendArkDialog.html',
      bindings: {
        accountCtrl: '='
      },
      controller: sendTransactionController
    })

  function sendTransactionController ($scope) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
    }
  }

})()
