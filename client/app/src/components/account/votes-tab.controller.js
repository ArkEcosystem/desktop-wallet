;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('votesTab', {
      templateUrl: 'src/components/account/votes-tab.html',
      bindings: {
        accountCtrl: '='
      },
      controller: VotesTabController
    })

  function VotesTabController ($scope) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
    }
  }

})()
