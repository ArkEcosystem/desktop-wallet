;(function () {
  'use strict'

  /**
   * NOTE: This component still uses parts of the AccountController
   */

  angular
    .module('arkclient.components')
    .component('accountBox', {
      templateUrl: 'src/components/dashboard/account-box.html',
      bindings: {
        accountCtrl: '='
      },
      controller: ['$scope', 'networkService', 'accountService', 'ARKTOSHI_UNIT', AccountBoxController]
    })

  function AccountBoxController ($scope, networkService, accountService, ARKTOSHI_UNIT) {
    this.$onInit = () => {
      // Alias that is used on the template
      this.ac = this.accountCtrl
    }

    this.myAccountsBalance = () => {
      const total = this.accountCtrl.getAllAccounts().reduce( (sum, account) => {
        return sum + parseInt(account.balance || 0)
      }, 0)

      return (total / ARKTOSHI_UNIT).toFixed(2)
    }

    this.myAccountsCurrencyBalance = () => {
      const market = this.accountCtrl.connectedPeer.market
      const currencyName = this.accountCtrl.currency.name
      const price = market && market.price ? market.price[currencyName] : 0

      return this.myAccountsBalance() * price
    }
  }

})()
