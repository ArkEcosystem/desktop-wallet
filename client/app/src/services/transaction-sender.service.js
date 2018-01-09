;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('transactionSenderService', ['$mdDialog', 'utilityService', 'accountService', 'transactionBuilderService', TransactionSenderService])

  /**
   * TransactionSenderService
   * @constructor
   */
  function TransactionSenderService ($mdDialog, utilityService, accountService, transactionBuilderService) {

    function cancel () {
      $mdDialog.hide()
    }

    function processTransactionsData(data) {
      accountService.getFees(true)
        .then(fees => {
          return data.map(d => {
            // TODO check that data is valid (no string instead of number, etc.)
            return {
              address: d[0],
              amount: parseFloat(d[1]), // TODO test parsing
              smartbridge: d[2],
              fee: fees.vote,
            }
          })
        })
        .catch(error => console.error('LOLLLLLL')) // FIXME
    }

    // TODO
    function showValidateTransactions ($scope, selectedAccount, transactionsData) {

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

      processTransactionsData(transactionsData)
        .then(transactions => {
          const amount = transactions.reduce((total, t) => total + t.amount, 0)
          const total = transactions.reduce((total, t) => total + t.amount + t.fee, 0)

          $scope.validate = {
            saveFile,
            send,
            cancel,
            query: {
              order: 'address'
            },
            transactions,
            // TODO
            // labels: accountService.getTransactionLabel(transaction),
            // TODO totals
            // to avoid small transaction to be displayed as 1e-8
            humanAmount: utilityService.arktoshiToArk(amount).toString(),
            totalAmount: utilityService.arktoshiToArk(total).toString()
          }

          $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            parent: angular.element(document.getElementById('app')),
            templateUrl: './src/components/account/templates/validate-transactions.html',
            clickOutsideToClose: false
          })
        })
    }

    return {
      showValidateTransactions
    }
  }

})()
