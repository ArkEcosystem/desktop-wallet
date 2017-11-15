;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('signingTab', {
      templateUrl: 'src/components/account/templates/signing-tab.html',
      bindings: {
        accountCtrl: '='
      },
      controller: SigningTabController
    })

  function SigningTabController ($scope) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
    }
  }

})()
