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
      controller: ['$scope', '$mdDialog', 'gettextCatalog', 'accountService', 'storageService', SigningTabController]
    })

  function SigningTabController ($scope, $mdDialog, gettextCatalog, accountService, storageService) {
    this.$onInit = () => {
      this.ul = this.accountCtrl
    }

    function showMessage (message) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.getElementById('app')))
          .clickOutsideToClose(true)
          .title(message)
          .ariaLabel(message)
          .theme(self.currentTheme) // eslint-disable-line no-undef
          .ok(gettextCatalog.getString('Ok'))
      )
    }

    this.signMessage = selectedAccount => {
      function sign () {
        const passphrase = $scope.sign.passphrase
        const message = $scope.sign.message

        if (!selectedAccount.signedMessages) {
          selectedAccount.signedMessages = []
        }

        let promisedSignature = null
        if (selectedAccount.ledger) {
          promisedSignature = accountService.signMessageWithLedger(message, selectedAccount.ledger)
        } else {
          promisedSignature = accountService.signMessage(message, passphrase)
        }

        promisedSignature.then(
          (result) => {
            selectedAccount.signedMessages.push({
              publickey: selectedAccount.publicKey,
              signature: result.signature,
              message: message
            })
            storageService.set('signed-' + selectedAccount.address, selectedAccount.signedMessages)
            $mdDialog.hide()
          },
          (error) => {
            accountCtrl.showMessage(error) // eslint-disable-line no-undef
          }
        )
      }

      function cancel () {
        $mdDialog.hide()
      }

      $scope.sign = {
        passphrase: '',
        sign,
        cancel,
        selectedAccount
      }

      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        templateUrl: './src/accounts/view/signMessage.html',
        clickOutsideToClose: false
      })
    }

    this.deleteSignedMessage = (selectedAccount, signedMessage) => {
      const index = selectedAccount.signedMessages.indexOf(signedMessage)
      selectedAccount.signedMessages.splice(index, index + 1)
      storageService.set('signed-' + selectedAccount.address, selectedAccount.signedMessages)
    }

    this.verifyMessage = signedMessage => {
      function verify () {
        console.log($scope.verify)
        const message = $scope.verify.message
        const publickey = $scope.verify.publickey
        const signature = $scope.verify.signature
        const result = accountService.verifyMessage(message, publickey, signature)

        $mdDialog.hide()
        showMessage(result)
      }

      function verifyText () {
        const list = JSON.parse($scope.verify.message)
        const res = accountService.verifyMessage(list['message'], list['publickey'], list['signature'])

        let message = gettextCatalog.getString('Error in signature processing')

        $mdDialog.hide()
        if (res) {
          message = gettextCatalog.getString('The message is verified successfully')
        } else {
          message = gettextCatalog.getString('The message is NOT verified')
        }
        this.accountCtrl.showMessage(message, res)
      }

      function cancel () {
        $mdDialog.hide()
      }

      if (signedMessage) {
        $scope.verify = signedMessage
        verify()
      } else {
        $scope.verify = {
          verify,
          verifyText,
          cancel,
          publickey: this.accountCtrl.selected.publicKey
        }

        $mdDialog.show({
          scope: $scope,
          preserveScope: true,
          templateUrl: './src/accounts/view/verifyMessage.html',
          clickOutsideToClose: false
        })
      }
    }
  }
})()
