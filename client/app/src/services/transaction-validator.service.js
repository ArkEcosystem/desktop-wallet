;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('transactionValidatorService', ['$mdDialog', 'gettextCatalog', 'utilityService', 'accountService', 'networkService', 'toastService', 'transactionBuilderService', TransactionValidatorService])

  /**
   * TransactionValidatorService
   * @constructor
   *
   * This service is used to validate transactions
   */
  function TransactionValidatorService ($mdDialog, gettextCatalog, utilityService, accountService, networkService, toastService, transactionBuilderService) {

    const openDialogIn = ($scope, selectedAccount, transactions) => {

      // TODO dialogService ?
      const cancel = () => $mdDialog.hide()
      const openDialog = templateUrl => {
        $mdDialog.show({
          scope: $scope,
          templateUrl,
          preserveScope: true,
          clickOutsideToClose: false,
          parent: angular.element(document.getElementById('app'))
        })
      }

      // TODO merge with AcCtrl
      function saveFile () {
        const fs = require('fs')
        const raw = JSON.stringify(transactions)

        const defaultPath = `${selectedAccount.address} (${new Date()}).json`

        require('electron').remote.dialog.showSaveDialog({
          defaultPath,
          filters: [{ extensions: ['json'] }]
        }, function (fileName) {
          if (fileName === undefined) return

          fs.writeFile(fileName, raw, 'utf8', function (err) {
            if (err) {
              toastService.error(
                gettextCatalog.getString('Failed to save transactions file') + ': ' + err,
                null,
                true
              )
            } else {
              toastService.success(
                gettextCatalog.getString('Transactions file successfully saved in') + ' ' + fileName,
                null,
                true
              )
            }
          })
        })
      }

      // TODO sending/loading?
      function send () {
        $mdDialog.hide()

        const transactionDelay = 3000

        transactions.map((transaction, i) => {
          return new Promise((resolve, reject) => {
            transaction = accountService.formatTransaction(transaction, selectedAccount.address)
            transaction.confirmations = 0

            console.log(transaction, i);

            setTimeout(()=> {
              networkService.postTransaction(transaction).then(
                transaction => {
                  selectedAccount.transactions.unshift(transaction)
                  toastService.success(
                    gettextCatalog.getString('Transaction') + ' ' + transaction.id + ' ' + gettextCatalog.getString('sent with success!'),
                    null,
                    true
                  )
                  resolve()
                },
                error => {
                  // TODO to toastService
                  // formatAndToastError(error)
                  console.log(error);
                  reject()
                }
              )
            }, i * transactionDelay)
          })
        })
      }

      const amount = transactions.reduce((total, t) => total + t.amount, 0)
      const total = transactions.reduce((total, t) => total + t.amount + t.fee, 0)
      const fees = transactions.reduce((total, t) => total + t.fee, 0)
      const balance = selectedAccount.balance - total

      $scope.validate = {
        saveFile,
        send,
        cancel,
        order: 'amount', // TODO
        limit: 25, // TODO
        senderAddress: selectedAccount.address,
        transactions,
        humanAmount: utilityService.arktoshiToArk(amount).toString(),
        totalFees: utilityService.arktoshiToArk(fees).toString(),
        totalAmount: utilityService.arktoshiToArk(total).toString(),
        remainingBalance: utilityService.arktoshiToArk(balance).toString()
      }

      openDialog('./src/components/account/templates/validate-transactions-dialog.html')
    }

    return {
      openDialogIn,
    }
  }

})()
