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
      controller: ['$scope', 'networkService', 'accountService', 'utilityService', AccountBoxController]
    })

  function AccountBoxController ($scope, networkService, accountService, utilityService) {
    this.$onInit = () => {
      // Alias that is used on the template
      this.ac = this.accountCtrl
    }

    this.myAccountsBalance = () => {
      const total = this.accountCtrl.getAllAccounts().reduce((sum, account) => {
        return sum + parseInt(account.balance || 0)
      }, 0)

      return utilityService.arktoshiToArk(total, true, 2)
    }

    this.myAccountsCurrencyBalance = (bitcoinToggleIsActive) => {
      const market = this.accountCtrl.connectedPeer.market
      const currencyName = bitcoinToggleIsActive && this.accountCtrl.btcValueActive ? 'btc' : this.accountCtrl.currency.name
      const price = market && market.price ? market.price[currencyName] : 0

      return this.myAccountsBalance() * price
    }

    this.refreshAccountBalances = () => {
      networkService.getPrice()

      this.accountCtrl.getAllAccounts().forEach(account => {
        accountService
          .refreshAccount(account)
          .then((updated) => { account.balance = updated.balance })
      })
    }
  }
})()
