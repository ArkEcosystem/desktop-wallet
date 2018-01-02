;(function () {
  'use strict'

  angular
    .module('arkclient.accounts')
    .controller('ExportAccountController', [
      '$scope',
      '$filter',
      '$mdDialog',
      'accountService',
      'toastService',
      'gettextCatalog',
      'account',
      'theme',
      'ARKTOSHI_UNIT',
      ExportAccountController
    ])

  function ExportAccountController ($scope, $filter, $mdDialog, accountService, toastService, gettextCatalog, account, theme, ARKTOSHI_UNIT) {
    $scope.vm = {}
    $scope.vm.account = account
    $scope.vm.theme = theme
    $scope.vm.numberOfReceivedTransactions = 0
    $scope.vm.hasStarted = false
    $scope.vm.isFinished = false

    // todo: move to utililityService once merged back
    $scope.vm.minDate = new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0))

    $scope.vm.startDate = new Date()
    $scope.vm.startDate.setMonth($scope.vm.startDate.getMonth() - 1)
    $scope.vm.endDate = new Date()

    $scope.fileContent = null

    $scope.vm.exportAccount = () => {
      $scope.vm.hasStarted = true

      if ($scope.vm.startDate) {
        $scope.vm.startDate.setHours(0, 0, 0, 0)
      }

      if ($scope.vm.endDate) {
        $scope.vm.endDate.setHours(23, 59, 59, 59)
      }

      accountService.getRangedTransactions($scope.vm.account.address, $scope.vm.startDate, $scope.vm.endDate, onUpdate).then(transactions => {
        prepareFile($scope.vm.account, transactions)
      }).catch(error => {
        if (error.transactions.length) {
          toastService.error('An error occured when getting your transactions. However we still got ' + error.transactions.length + ' transactions! ' +
                             'The exported file contains only these!',
          10000)
          prepareFile($scope.vm.account, error.transactions, true)
        } else {
          toastService.error('An error occured when getting your transactions. Cannot export account!', 10000)
          $mdDialog.hide()
        }
      })
    }

    $scope.vm.cancel = () => {
      $mdDialog.hide()
    }

    $scope.vm.getStartLabel = () => {
      if ($scope.vm.startDate) {
        return $filter('date')($scope.vm.startDate, 'mediumDate')
      }

      return gettextCatalog.getString('the beginning of time')
    }

    $scope.vm.getEndLabel = () => {
      if ($scope.vm.endDate) {
        return $filter('date')($scope.vm.endDate, 'mediumDate')
      }

      return gettextCatalog.getString('now')
    }

    $scope.vm.downloadFile = () => {
      var blob = new Blob([$scope.fileContent])
      var downloadLink = document.createElement('a')
      downloadLink.setAttribute('download', account.address + '.csv')
      downloadLink.setAttribute('href', window.URL.createObjectURL(blob))
      downloadLink.click()
      $mdDialog.hide()
    }

    function onUpdate (updateObj) {
      $scope.vm.numberOfReceivedTransactions += updateObj.transactions.length
    }

    function prepareFile (account, transactions, isInComplete) {
      $scope.vm.isFinished = true
      var eol = require('os').EOL

      // todo: use utilityService once merged back for the ark calculation
      $scope.fileContent = 'Account:,' + account.address + eol +
                           'Balance:,' + accountService.numberToFixed(account.balance / ARKTOSHI_UNIT) + eol +
                           'Transactions' + (isInComplete ? ' (INCOMPLETE):' : ':') + eol +
                           'ID,Confirmations,Date,Type,Amount,From,To,Smartbridge' + eol
      transactions.forEach(trns => {
        $scope.fileContent += trns.id + ',' +
                              trns.confirmations + ',' +
                              new Date(trns.date).toISOString() + ',' +
                              trns.label + ',' +
                              trns.humanTotal + ',' +
                              trns.senderId + ',' +
                              trns.recipientId + ',' +
                              (trns.vendorField ? trns.vendorField : '') + eol
      })
    }
  }
})()
