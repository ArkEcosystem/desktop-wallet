;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('transactionValidatorService', ['$mdDialog', 'utilityService', 'accountService', 'toastService', 'transactionBuilderService', TransactionValidatorService])

  /**
   * TransactionValidatorService
   * @constructor
   *
   * This service is used to validate transactions
   */
  function TransactionValidatorService ($mdDialog, utilityService, accountService, toastService, transactionBuilderService) {

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

      function saveFile () {
        // TODO merge with AcCtrl
      }

      function send () {
        $mdDialog.hide()

        transaction = accountService.formatTransaction(transaction, selectedAccount.address)
        transaction.confirmations = 0

        networkService.postTransaction(transaction).then(
          function (transaction) {
            selectedAccount.transactions.unshift(transaction)
            toastService.success(
              gettextCatalog.getString('Transaction') + ' ' + transaction.id + ' ' + gettextCatalog.getString('sent with success!'),
              null,
              true
            )
          },
          formatAndToastError
        )
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
