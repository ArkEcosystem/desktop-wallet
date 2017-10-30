;(function () {
  'use strict'

  angular
    .module('arkclient.accounts')
    .controller('AccountTransactionsController', [
      '$scope',
      '$timeout',
      'accountService',
      'storageService',
      AccountTransactionsController
    ])

  function AccountTransactionsController ($scope, $timeout, accountService, storageService) {
    const vm = this

    vm.INCREASE_API = 50
    vm.INCREASE_SCROLL = 10

    vm.address = undefined
    vm.transactions = []

    vm.pageSize = 10
    vm.limit = 50
    vm.offset = 0

    vm.isBusy = false // loading
    vm.isComplete = false // disable the request

    $scope.$on('account:onSelect', function (evt, account) {
      angular.element(document.querySelector('.tx-list-container'))[0].scrollTop = 0
      reset()

      vm.address = account.address
      updateTransactions(account.transactions)
    })

    $scope.$on('account:onRefreshTransactions', function (evt, transactions) {
      updateTransactions(transactions)
    })

    vm.loadNext = function () {
      if (vm.isBusy || vm.isComplete || vm.transactions.length === 0) return

      if (vm.pageSize < vm.transactions.length) {
        vm.pageSize += vm.INCREASE_SCROLL
        return
      }

      if (vm.pageSize >= vm.transactions.length) {
        vm.isBusy = true
        vm.offset += vm.INCREASE_API

        accountService.getTransactions(vm.address, vm.offset, vm.limit, false)
          .then((transactions) => {
            if (transactions.length === 0) {
              vm.isComplete = vm.isBusy = true
              return
            }

            updateTransactions(transactions)
            vm.pageSize += vm.INCREASE_SCROLL
            vm.isBusy = false
          })
          .catch(() => {
            // rollback
            vm.offset -= vm.INCREASE_API
            // wait 8s to try again
            $timeout(() => {
              if (!vm.isComplete) vm.isBusy = false
            }, 8000)
          })
      }
    }

    function reset () {
      vm.pageSize = 10
      vm.offset = 0
      vm.transactions = []

      vm.isBusy = false
      vm.isComplete = false
    }

    function updateTransactions (transactions) {
      if (!transactions) return

      var mergeTransactions = [...transactions, ...vm.transactions]
      // remove duplicates
      var uniqueTransactions = mergeTransactions.filter((obj, pos, arr) => {
        return arr.map(obj => obj['id']).indexOf(obj['id']) === pos
      }).sort((a, b) => b.timestamp - a.timestamp)

      vm.transactions = uniqueTransactions
      storageService.set(`transactions-${vm.address}`, vm.transactions, true)
    }
  }
})()
