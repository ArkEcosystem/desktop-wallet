;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('mainSidenav', {
      templateUrl: 'src/components/account/main-sidenav.html',
      bindings: {
        accountCtrl: '=',
        addressBookCtrl: '='
      },
      controller: MainSidenavController
    })

  function MainSidenavController ($scope) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
      this.ab = this.addressBookCtrl
    }
  }

})()
