;(function () {
  'use strict'

  /**
   * NOTE This component uses the entire AccountController yet: it's the first
   * step to refactor the `index.html`
   */

  angular
    .module('arkclient.components')
    .component('accountCard', {
      templateUrl: 'src/components/account/templates/account-card.html',
      bindings: {
        accountCtrl: '=',
        addressBookCtrl: '='
      },
      controller: ['$scope', '$mdDialog', '$mdBottomSheet', 'gettextCatalog', 'accountService', 'toastService', AccountCardController]
    })

  function AccountCardController ($scope, $mdDialog, $mdBottomSheet, gettextCatalog, accountService, toastService) {

    this.$onInit = () => {
      this.ul = this.accountCtrl
      this.ab = this.addressBookCtrl
    }

    /**
     * Show the account menu in the bottom sheet
     */
    this.showAccountMenu = (selectedAccount) => {
      const items = [
        { name: gettextCatalog.getString('Open in explorer'), icon: 'open_in_new' }
      ]

      if (!selectedAccount.ledger) {
        items.push({ name: gettextCatalog.getString('Remove'), icon: 'clear' })
      }
      if (!selectedAccount.delegate) {
        items.push({ name: gettextCatalog.getString('Label'), icon: 'local_offer' })

        if (!selectedAccount.ledger) {
          items.push({ name: gettextCatalog.getString('Register Delegate'), icon: 'perm_identity' })
        }
      }

      items.push({ name: gettextCatalog.getString('Timestamp Document'), icon: 'verified_user' })

      if (!selectedAccount.secondSignature && !selectedAccount.ledger) {
        items.push({ name: gettextCatalog.getString('Second Passphrase'), icon: 'lock' })
      }

      const answer = (action) => {
        $mdBottomSheet.hide()

        if (action === gettextCatalog.getString('Open in explorer')) {
          this.accountCtrl.openExplorer('/address/' + selectedAccount.address)
        }

        if (action === gettextCatalog.getString('Timestamp Document')) {
          this.accountCtrl.timestamp(selectedAccount)

        } else if (action === gettextCatalog.getString('Remove')) {
          const confirm = $mdDialog.confirm()
            .title(gettextCatalog.getString('Remove Account') + ' ' + selectedAccount.address)
            .theme(this.accountCtrl.currentTheme)
            .textContent(gettextCatalog.getString('Remove this account from your wallet. ' +
              'The account may be added again using the original passphrase of the account.'))
            .ok(gettextCatalog.getString('Remove account'))
            .cancel(gettextCatalog.getString('Cancel'))

          $mdDialog.show(confirm).then(function () {
            accountService.removeAccount(selectedAccount).then(function () {
              this.accountCtrl.accounts = accountService.loadAllAccounts()

              if (this.accountCtrl.accounts.length > 0) {
                selectAccount(this.accountCtrl.accounts[0])
              } else {
                this.accountCtrl.selected = null
              }

              toastService.success('Account removed!', 3000)
            })
          })
        } else if (action === gettextCatalog.getString('Register Delegate')) {
          this.accountCtrl.createDelegate(selectedAccount)

        } else if (action === gettextCatalog.getString('Label')) {
          const prompt = $mdDialog.prompt()
            .title(gettextCatalog.getString('Label'))
            .theme(this.accountCtrl.currentTheme)
            .textContent(gettextCatalog.getString('Please enter a short label.'))
            .placeholder(gettextCatalog.getString('label'))
            .ariaLabel(gettextCatalog.getString('Label'))
            .ok(gettextCatalog.getString('Set'))
            .cancel(gettextCatalog.getString('Cancel'))

          $mdDialog.show(prompt).then(function (label) {
            accountService.setUsername(selectedAccount.address, label)
            this.accountCtrl.accounts = accountService.loadAllAccounts()
            toastService.success('Label set', 3000)
          })

        } else if (action === gettextCatalog.getString('Second Passphrase')) {
          this.accountCtrl.createSecondPassphrase(selectedAccount)
        }
      }

      $scope.bs = {
        address: selectedAccount.address,
        answer: answer,
        items: items
      }

      $mdBottomSheet.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: 'src/components/account/templates/account-menu.html',
        clickOutsideToClose: true,
        preserveScope: true,
        scope: $scope
      })
    }
  }

})()
