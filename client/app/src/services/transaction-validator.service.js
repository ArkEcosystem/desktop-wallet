;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('transactionValidatorService', ['$timeout', 'dialogService', 'gettextCatalog', 'utilityService', 'accountService', 'networkService', 'toastService', 'transactionBuilderService', TransactionValidatorService])

  /**
   * TransactionValidatorService
   * @constructor
   *
   * This service is used to validate multiple transactions
   */
  function TransactionValidatorService ($timeout, dialogService, gettextCatalog, utilityService, accountService, networkService, toastService, transactionBuilderService) {
    const openDialogIn = ($scope, selectedAccount, transactions) => {
      // TODO merge with the method from AccountController
      const saveFile = () => {
        const fs = require('fs')
        const defaultPath = `${selectedAccount.address} (${new Date()}).json`

        require('electron').remote.dialog.showSaveDialog({
          defaultPath,
          filters: [{ extensions: ['json'] }]
        }, fileName => {
          if (fileName === undefined) return

          const raw = JSON.stringify(transactions)
          fs.writeFile(fileName, raw, 'utf8', err => {
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

      // Transactions that are being processed
      let processing

      const send = () => {
        $scope.validate.sent = true

        const delayBetweenTransactions = 2000

        processing = $scope.validate.transactions.map((transaction, i) => {
          const transactionPromise = $timeout(i * delayBetweenTransactions)

          // Store the transaction to update its `sendStatus` later
          transactionPromise.$$transaction = transaction

          transactionPromise.then(() => {
            transaction.sendStatus = 'sending'

            transaction = accountService.formatTransaction(transaction, selectedAccount.address)
            transaction.confirmations = 0

            networkService.postTransaction(transaction).then(
              transaction => {
                transaction.sendStatus = 'ok'
                selectedAccount.transactions.unshift(transaction)
              },
              () => {
                transaction.sendStatus = 'error'
              }
            )
          })

          // Return the `$timeout` promise (instead of the one returned by `then`) to keep its ID
          return transactionPromise
        })

        const updateStatus = () => {
          if (transactions.some(t => t.sendStatus === 'error')) {
            $scope.validate.status = 'error'
          } else if (transactions.some(t => t.sendStatus === 'cancelled' || t.sendStatus === 'error cancelling')) {
            $scope.validate.status = 'cancelled'
          } else {
            $scope.validate.status = 'ok'
          }
        }

        Promise.all(processing)
          .then(updateStatus)
          .catch(updateStatus)
      }

      /**
       * Close the dialog or stop the sending of transactions
       */
      const cancel = () => {
        if (!$scope.validate.sent) {
          dialogService.hide()
        } else if ($scope.validate.status !== 'pristine') {
          dialogService.hide()
        } else {
          processing.forEach(transactionPromise => {
            const transaction = transactionPromise.$$transaction

            if (!transaction.sendStatus || transaction.sendStatus === 'pending') {
              transaction.sendStatus = $timeout.cancel(transactionPromise) ? 'cancelled' : 'error cancelling'
            }
          })
        }
      }

      const amount = transactions.reduce((total, t) => total + t.amount, 0)
      const total = transactions.reduce((total, t) => total + t.amount + t.fee, 0)
      const fees = transactions.reduce((total, t) => total + t.fee, 0)
      const balance = selectedAccount.balance - total

      $scope.validate = {
        sent: false,
        status: 'pristine',
        saveFile,
        send,
        cancel,
        senderAddress: selectedAccount.address,
        transactions,
        humanAmount: utilityService.arktoshiToArk(amount).toString(),
        totalFees: utilityService.arktoshiToArk(fees).toString(),
        totalAmount: utilityService.arktoshiToArk(total).toString(),
        remainingBalance: utilityService.arktoshiToArk(balance).toString()
      }

      dialogService.open({
        scope: $scope,
        templateUrl: './src/components/account/templates/validate-transactions-dialog.html'
      })
    }

    return {
      openDialogIn
    }
  }
})()
