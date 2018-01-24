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
      controller: ['$scope', '$mdDialog', '$mdBottomSheet', 'gettextCatalog', 'accountService', 'storageService', 'toastService', 'transactionBuilderService', 'utilityService', 'neoApiService', '$timeout', AccountCardController]
    })

  function AccountCardController ($scope, $mdDialog, $mdBottomSheet, gettextCatalog, accountService, storageService, toastService, transactionBuilderService, utilityService, neoApiService, $timeout) {
    let getCurrentAccount = () => null

    $scope.$on('app:onURI', (event, scheme) => {
      transactionSenderService.openDialogIn($scope, this.accountCtrl, getCurrentAccount(), scheme)
    })

    this.$onInit = () => {
      this.ul = this.accountCtrl
      const ul = this.ul
      // by assigning this to the function, we can ensure, that a call to the function will always return the currently active account
      getCurrentAccount = () => ul.selected
      this.ab = this.addressBookCtrl
    }

    this.accountMenuItems = account => {
      const items = []
      const add = (text, icon) => items.push({ name: gettextCatalog.getString(text), icon })

      add('Open in explorer', 'open_in_new')

      if (!account.ledger) {
        add('Remove', 'clear')
      }
      if (!account.delegate) {
        add('Label', 'local_offer')

        if (!account.ledger) {
          add('Register Delegate', 'perm_identity')
        }
      }

      add('Timestamp Document', 'verified_user')

      if (!account.secondSignature && !account.ledger) {
        add('Second Passphrase', 'lock')
      }

      return items
    }

    this.confirmRemoval = account => {
      const confirm = $mdDialog.confirm({
        title: gettextCatalog.getString('Remove Account') + ' ' + account.address,
        ariaLabel: gettextCatalog.getString('Remove Account'),
        theme: this.accountCtrl.currentTheme,
        textContent: gettextCatalog.getString('Remove this account from your wallet. ' +
          'The account may be added again using the original passphrase of the account.'),
        ok: gettextCatalog.getString('Remove account'),
        cancel: gettextCatalog.getString('Cancel')
      })

      return $mdDialog.show(confirm).then(() => {
        return accountService.removeAccount(account).then(() => {
          this.accountCtrl.accounts = accountService.loadAllAccounts()

          if (this.accountCtrl.accounts && this.accountCtrl.accounts.length > 0) {
            this.accountCtrl.selectAccount(this.accountCtrl.accounts[0])
          } else {
            this.accountCtrl.selected = null
          }

          toastService.success('Account removed!', 3000)
        })
      })
    }

    this.promptLabel = account => {
      const currentLabel = accountService.getUsername(account.address)
      const labelText = gettextCatalog.getString('Label')

      const prompt = $mdDialog.prompt({
        title: labelText,
        ariaLabel: labelText,
        theme: this.accountCtrl.currentTheme,
        textContent: gettextCatalog.getString('Please enter a short label.'),
        placeholder: labelText,
        initialValue: currentLabel,
        ok: gettextCatalog.getString('Set'),
        cancel: gettextCatalog.getString('Cancel')
      })

      return $mdDialog.show(prompt).then(label => {
        accountService.setUsername(account.address, label)
        this.accountCtrl.accounts = accountService.loadAllAccounts()
        toastService.success('Label set', 3000)
      })
    }

    /**
     * Show the account menu on the bottom sheet
     */
    this.showAccountMenu = selectedAccount => {
      const items = this.accountMenuItems(selectedAccount)

      const answer = action => {
        $mdBottomSheet.hide()

        if (action === gettextCatalog.getString('Open in explorer')) {
          this.accountCtrl.openExplorer('/address/' + selectedAccount.address)
        } else if (action === gettextCatalog.getString('Timestamp Document')) {
          this.accountCtrl.timestamp(selectedAccount)
        } else if (action === gettextCatalog.getString('Remove')) {
          this.confirmRemoval(selectedAccount)
        } else if (action === gettextCatalog.getString('Register Delegate')) {
          this.accountCtrl.createDelegate(selectedAccount)
        } else if (action === gettextCatalog.getString('Label')) {
          this.promptLabel(selectedAccount)
        } else if (action === gettextCatalog.getString('Second Passphrase')) {
          this.accountCtrl.createSecondPassphrase(selectedAccount)
        }
      }

      $scope.bs = {
        label: selectedAccount.username,
        address: selectedAccount.address,
        answer,
        items
      }

      $mdBottomSheet.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: 'src/components/account/templates/account-menu.html',
        clickOutsideToClose: true,
        preserveScope: true,
        scope: $scope
      })
    }

    this.openSendTransactionDialog = selectedAccount => {
      transactionSenderService.openDialogIn($scope, this.accountCtrl, selectedAccount)
    }
  }
})()
