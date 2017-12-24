;(function () {
  'use strict'

  angular
    .module('arkclient.accounts')
    .controller('ExportAccountController', [
      '$scope',
      '$mdDialog',
      'accountService',
      'toastService',
      'account',
      'theme',
      ExportAccountController
    ])

  function ExportAccountController ($scope, $mdDialog, accountService, toastService, account, theme) {
    $scope.vm = {}
    $scope.vm.account = account
    $scope.vm.theme = theme
    $scope.vm.numberOfReceivedTransactions = 0
    $scope.vm.hasStarted = false
    $scope.vm.maxLimit = 50

    $scope.vm.exportAccount = () => {
      $scope.vm.hasStarted = true
      accountService.getAllTransactions($scope.vm.account.address, $scope.vm.maxLimit, onUpdate).then(transactions => {
        downloadAccountFile($scope.vm.account, transactions)
      }).catch(error => {
        if (error.transactions.length) {
          toastService.error('An error occured when getting all your transactions. However we still got ' + error.transactions.length + ' transactions! ' +
                             'The exported file contains only these!',
                             10000)
          downloadAccountFile($scope.vm.account, error.transactions, true)
        } else {
          toastService.error('An error occured when getting all your transactions. Cannot export account!', 10000)
        }
      }).finally(() => $mdDialog.hide())
    }

    $scope.vm.cancel = () => {
      $mdDialog.hide()
    }

    function onUpdate (updateObj) {
      $scope.vm.numberOfReceivedTransactions += updateObj.transactions.length
    }

    function downloadAccountFile (account, transactions, isInComplete) {
      var eol = require('os').EOL

      var filecontent = 'Account:,' + account.address + eol + 'Balance:,' + account.balance + eol + 'Transactions' + (isInComplete ? ' (INCOMPLETE):' : ':') + eol + 'ID,Confirmations,Date,Type,Amount,From,To,Smartbridge' + eol
      transactions.forEach(function (trns) {
        var date = new Date(trns.date)
        filecontent = filecontent + trns.id + ',' + trns.confirmations + ',' + date.toISOString() + ',' + trns.label + ',' + trns.humanTotal + ',' + trns.senderId + ',' + trns.recipientId +
          ',' + trns.vendorField + eol
      })
      var blob = new Blob([filecontent])
      var downloadLink = document.createElement('a')
      downloadLink.setAttribute('download', account.address + '.csv')
      downloadLink.setAttribute('href', window.URL.createObjectURL(blob))
      downloadLink.click()
    }
  }
})()
