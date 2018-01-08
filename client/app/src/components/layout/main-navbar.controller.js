;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('mainNavbar', {
      templateUrl: 'src/components/layout/main-navbar.html',
      bindings: {
        accountCtrl: '=',
        addressBookCtrl: '='
      },
      controller: MainNavbarController
    })

  function MainNavbarController ($scope) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
      this.ab = this.addressBookCtrl
    }
  }
})()
