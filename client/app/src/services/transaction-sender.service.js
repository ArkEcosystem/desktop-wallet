;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('transactionSenderService', ['$mdDialog', 'utilityService', 'accountService', 'storageService', 'toastService', 'transactionBuilderService', TransactionSenderService])

  /**
   * TransactionSenderService
   * @constructor
   *
   * This service is used to send transactions; from displaying the dialog to
   * validating and executing them.
   */
  function TransactionSenderService ($mdDialog, utilityService, accountService, storageService, toastService, transactionBuilderService) {

    function cancel () {
      $mdDialog.hide()
    }

    /**
     * Show the send transaction dialog. Reuses the controller and its $scope TODO
     */
    const openDialogIn = ($scope, accountCtrl, selectedAccount) => {
      const passphrases = accountService.getPassphrases(selectedAccount.address)

      const selectFile = () => {
        require('electron').remote.dialog.showOpenDialog(fileNames => {
          if (fileNames === undefined) return

          $scope.send.data.file = fileNames[0]
        })
      }

      const parse = filePath => {
        const fs = require('fs')
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            toastService.error('Unable to load file' + ': ' + err)
          } else {
            const parse = require('csv-parse')
            parse(data, { quote: null }, (err, transactions) => {
              if (err) {
                return toastService.error('Error while parsing the file')
              }

              this.showValidateTransactions(selectedAccount, transactions)
            })
          }
        })
      }

      const submitTransaction = (selectedAccount, formData) => {
        return transactionBuilderService.createSendTransaction({
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          fromAddress: formData.fromAddress,
          toAddress: formData.toAddress,
          amount: parseInt(utilityService.arkToArktoshi(formData.amount, 0)),
          smartbridge: formData.smartbridge,
          masterpassphrase: formData.passphrase,
          secondpassphrase: formData.secondpassphrase
        })
          .then(transaction => {
            accountCtrl.showValidateTransaction(selectedAccount, transaction)
          },
          accountCtrl.formatAndToastError
        )
      }

      function getTotalBalance (fee) {
        const balance = selectedAccount.balance
        return utilityService.arktoshiToArk(fee ? balance - fee : balance)
      }

      function fillSendableBalance () {
        function setBalance (fee) {
          const sendableBalance = getTotalBalance(fee)
          $scope.send.data.amount = sendableBalance > 0 ? sendableBalance : 0
        }
        // set the balance immediately, so the user sees something
        setBalance(accountService.defaultFees.send)
        // now get the real fees and set it again if necessary
        accountService.getFees(true).then((fees) => {
          if (fees.send !== accountService.defaultFees.send) {
            setBalance(fees.send)
          }
        })
      }

      const submit = tab => {
        if (!$scope[`${tab}Form`].$valid) {
          return
        }

        // In case of data selected from contacts
        if ($scope.send.data.toAddress.address) {
          $scope.send.data.toAddress = $scope.send.data.toAddress.address
        }

        // Remove bad characters before and after in case of bad copy/paste
        $scope.send.data.toAddress = $scope.send.data.toAddress.trim()
        $scope.send.data.passphrase = $scope.send.data.passphrase.trim()

        if ($scope.send.data.secondpassphrase) {
          $scope.send.data.secondpassphrase = $scope.send.data.secondpassphrase.trim()
        }

        $mdDialog.hide()

        if (tab === 'unique') {
          submitTransaction(selectedAccount, $scope.send.data)
        } else if (tab === 'multiple') {
          submitTransactions(selectedAccount, $scope.send.data)
        } else {
          throw new Error(`Unknown tab "${tab}"`)
        }
      }

      const querySearch = (text) => {
        text = text.toLowerCase()

        let accounts = accountCtrl.getAllAccounts()
        let contacts = storageService.get('contacts') || []

        contacts = contacts.concat(accounts).sort(function (a, b) {
          if (a.name && b.name) return a.name < b.name
          else if (a.username && b.username) return a.username < b.username
          else if (a.username && b.name) return a.username < b.name
          else if (a.name && b.username) return a.name < b.username
        })

        return contacts.filter(function (account) {
          return (account.address.toLowerCase().indexOf(text) > -1) || (account.name && (account.name.toLowerCase().indexOf(text) > -1))
        })
      }

      function checkContacts (input) {
        if (input[0] !== '@') return true
      }

      const data = {
        ledger: selectedAccount.ledger,
        fromAddress: selectedAccount ? selectedAccount.address : '',
        secondSignature: selectedAccount ? selectedAccount.secondSignature : '',
        passphrase: passphrases[0] ? passphrases[0] : '',
        secondpassphrase: passphrases[1] ? passphrases[1] : ''
      }

      $scope.ac = accountCtrl

      $scope.send = {
        tab: 'unique',
        selectFile,
        data,
        cancel,
        submit,
        checkContacts,
        querySearch,
        fillSendableBalance,
        totalBalance: getTotalBalance(0),
        remainingBalance: getTotalBalance(0) // <-- initial value, this will change by directive
      }

      $scope.send.searchTextChange = text => {
        $scope.send.data.toAddress = text
      }

      $scope.send.selectedContactChange = contact => {
        if (contact) {
          $scope.send.data.toAddress = contact.address
        }
      }

      $scope.send.selectTab = tab => {
        $scope.send.tab = tab
      }

      $scope.onQrCodeForToAddressScanned = (address) => {
        // this will trigger the selectedContactChange function, which will then set the toAddress
        $scope.send.data.selectedAddress = {address: address}
      }

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/components/account/templates/send-transaction-dialog.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      })
    }

    this.showValidateTransactions = function(selectedAccount, transactions) {
      transactionSenderService.showValidateTransactions($scope, selectedAccount, transactions)
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
      openDialogIn,
    }
  }

})()
