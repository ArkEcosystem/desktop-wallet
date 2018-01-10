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
        accountCtrl: '=',
        addressbookCtrl: '='
      },
      controller: ['$scope', 'networkService', 'accountService', 'utilityService', 'gettextCatalog', 'toastService', '$timeout', AccountBoxController]
    })

  function AccountBoxController ($scope, networkService, accountService, utilityService, gettextCatalog, toastService, $timeout) {
    this.$onInit = () => {
      // Alias that is used on the template
      this.ac = this.accountCtrl

      this.myAccountsType = this.createAccountType('My Accounts',
                                                   this.ac.myAccounts,
                                                   this.ac.getAllAccounts,
                                                   utilityService.createRefreshState('Accounts refreshed', 'Could not refresh accounts'),
                                                   this.ac.createAccount,
                                                   'Create Account',
                                                   this.ac.importAccount,
                                                   'Import Account')

      this.contactsType = this.createAccountType('Contacts',
                                                 this.addressbookCtrl.getContacts,
                                                 this.addressbookCtrl.getContacts,
                                                 utilityService.createRefreshState('Contacts refreshed', 'Could not refresh contacts'),
                                                 () => this.addressbookCtrl.addAddressbookContact(() => this.refreshAccounts()),
                                                 'Add Contact')

      if (this.myAccountsType.getAccountsToRefresh().length || !this.contactsType.getAccountsToRefresh().length) {
        this.selectedAccountType = this.myAccountsType
      } else {
        this.selectedAccountType = this.contactsType
      }

      this.accountTypes = [this.myAccountsType, this.contactsType]

      let didInitialRefresh = false
      networkService.getConnection()
        .then(() => {},
              () => {},
              (connectedPeer) => {
                if (connectedPeer.isConnected && !didInitialRefresh) {
                  $timeout(this.refreshAccounts, 500)
                  didInitialRefresh = true
                }
              })
    }

    this.createAccountType = (title,
                              getDisplayAccountsFunc,
                              getAccountsToRefreshFunc,
                              refreshState,
                              createAccountFunc,
                              createAccountText,
                              importAccountFunc,
                              importAccountText) => {
      return {
        title: gettextCatalog.getString(title),
        getDisplayAccounts: getDisplayAccountsFunc,
        getAccountsToRefresh: getAccountsToRefreshFunc,
        createAccount: createAccountFunc,
        createAccountText: gettextCatalog.getString(createAccountText),
        importAccount: importAccountFunc,
        importAccountText: gettextCatalog.getString(importAccountText),
        refreshState: refreshState
      }
    }

    this.refreshAccounts = (showToast) => {
      this.refreshAccountBalances(showToast,
                                  this.selectedAccountType.getAccountsToRefresh(),
                                  this.selectedAccountType.refreshState)
    }

    this.refreshAccountBalances = (showToast, accounts, refreshState) => {
      if (!accounts.length || !refreshState.shouldRefresh()) {
        return
      }

      networkService.getPrice()

      accounts.forEach(account => {
        var state = refreshState.create()
        accountService
          .refreshAccount(account)
          .then(updated => { account.balance = updated.balance })
          .catch(() => { state.hasError = true })
          .finally(() => {
            state.isFinished = true
            refreshState.updateRefreshState(showToast ? toastService : null)
          })
      })
    }

    this.getTotalBalance = (accountType) => {
      const total = accountType.getAccountsToRefresh().reduce((sum, account) => {
        return sum + parseInt(account.balance || 0)
      }, 0)

      return utilityService.arktoshiToArk(total, true, 2)
    }

    this.currencyBalance = (accountType) => {
      const market = this.accountCtrl.connectedPeer.market
      const currencyName = this.accountCtrl.btcValueActive ? 'btc' : this.accountCtrl.currency.name
      const price = market && market.price ? market.price[currencyName] : 0

      return this.getTotalBalance(accountType) * price
    }
  }
})()
