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
    vm.INCREASE_SCROLL = 50

    vm.address = undefined

    reset()

    $scope.$on('account:onSelect', (evt, account) => {
      vm.address = account.address
      reset()
      angular.element(document.querySelector('.tx-list-container'))[0].scrollTop = 0
      updateTransactions(account.transactions)
    })

    $scope.$on('account:onRefreshTransactions', (evt, transactions) => {
      reset()
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
      vm.pageSize = 50
      vm.offset = 25
      vm.transactions = []

      vm.isBusy = false // loading
      vm.isComplete = false // disable the request
    }

    function updateTransactions (transactions) {
      if (!transactions) return

      const mergeTransactions = [...transactions, ...vm.transactions]
      // remove duplicates
      const uniqueTransactions = mergeTransactions.filter((obj, pos, arr) => {
        return arr.map(obj => obj['id']).indexOf(obj['id']) === pos
      }).sort((a, b) => b.timestamp - a.timestamp)

      vm.transactions = uniqueTransactions
      storageService.set(`transactions-${vm.address}`, vm.transactions, true)
    }
  }
})()
