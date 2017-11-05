;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('accountCard', {
      templateUrl: 'src/components/account/account-card.html',
      bindings: {
        accountCtrl: '=',
        addressBookCtrl: '='
      },
      controller: AccountCardController
    })

  function AccountCardController ($scope) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
      this.ab = this.addressBookCtrl
    }
  }

})()
