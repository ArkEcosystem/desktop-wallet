;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('delegateTab', {
      templateUrl: 'src/components/account/templates/delegate-tab.html',
      bindings: {
        accountCtrl: '='
      },
      controller: DelegateTabController
    })

  function DelegateTabController ($scope) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
    }
  }

})()
