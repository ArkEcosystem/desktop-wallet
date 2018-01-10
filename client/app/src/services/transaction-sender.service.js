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

    const cancel = () => $mdDialog.hide()

    /**
     * Show the send transaction dialog. Reuses the controller and its $scope TODO
     */
    const openDialogIn = ($scope, accountCtrl, selectedAccount) => {
      const passphrases = accountService.getPassphrases(selectedAccount.address)

      const openDialog = (templateUrl) => {
        $mdDialog.show({
          scope: $scope,
          templateUrl,
          preserveScope: true,
          clickOutsideToClose: false,
          parent: angular.element(document.getElementById('app'))
        })
      }

      const getTotalBalance = fee => {
        const balance = selectedAccount.balance
        return utilityService.arktoshiToArk(fee ? balance - fee : balance)
      }

      const parseTransactionsFile = (filePath, callback) => {
        const fs = require('fs')
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            toastService.error('Unable to load file' + ': ' + err)
          } else {
            const parse = require('csv-parse')
            parse(data, { quote: null }, (err, transactionsData) => {
              if (err) {
                return toastService.error('Error while parsing the file')
              }

              callback(transactionsData)
            })
          }
        })
      }

      const showValidateMultipleTransactions = (selectedAccount, transactions) => {

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

        openDialog('./src/components/account/templates/validate-transactions.html')
      }

      const processTransactionsData = data => {
        return data.map(d => {
          return {
            address: d[0],
            amount: Number(utilityService.arkToArktoshi(parseFloat(d[1]))), // TODO test parsing
            smartbridge: d[2],
          }
        })
      }

      const prepareTransaction = (selectedAccount, data) => {
        return transactionBuilderService.createSendTransaction(data)
          .then(
            transaction => accountCtrl.showValidateTransaction(selectedAccount, transaction),
            accountCtrl.formatAndToastError
          )
      }

      const prepareMultipleTransactions = (selectedAccount, data) => {
        return transactionBuilderService.createMultipleSendTransactions(data)
          .then(
            transactions => showValidateMultipleTransactions(selectedAccount, transactions),
            accountCtrl.formatAndToastError
          )
      }

      $scope.submit = tab => {
        if (!$scope[`${tab}Form`].$valid) {
          return
        }

        const data = {
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          masterpassphrase: $scope.data.passphrase.trim(),
          fromAddress: $scope.data.fromAddress,
        }

        if ($scope.data.secondPassphrase) {
          data.secondpassphrase = $scope.data.secondPassphrase.trim()
        }

        $mdDialog.hide()

        if (tab === 'unique') {
          data.toAddress = $scope.data.toAddress.trim()
          data.amount = $scope.data.amount
          data.smartbridge = $scope.data.smartbridge

          prepareTransaction(selectedAccount, data)

        } else if (tab === 'multiple') {
          parseTransactionsFile($scope.data.file, transactionsData => {
            data.transactions = processTransactionsData(transactionsData)

            prepareMultipleTransactions(selectedAccount, data)
          })

        } else {
          throw new Error(`Unknown tab "${tab}"`)
        }
      }

      $scope.ac = accountCtrl
      $scope.network = accountCtrl.network

      $scope.tab = 'unique',
      $scope.data = {
        ledger: selectedAccount.ledger,
        fromAddress: selectedAccount ? selectedAccount.address : '',
        secondSignature: selectedAccount ? selectedAccount.secondSignature : '',
        passphrase: passphrases[0] ? passphrases[0] : '',
        secondPassphrase: passphrases[1] ? passphrases[1] : ''
      }
      $scope.totalBalance = getTotalBalance(0)
      $scope.remainingBalance = getTotalBalance(0) // <-- initial value, this will change by directive

      $scope.cancel = cancel

      $scope.selectFile = () => {
        require('electron').remote.dialog.showOpenDialog(fileNames => {
          if (fileNames === undefined) return

          $scope.data.file = fileNames[0]
        })
      }

      $scope.selectTab = tab => {
        $scope.tab = tab
      }

      $scope.fillSendableBalance  = () => {
        function setBalance (fee) {
          const sendableBalance = getTotalBalance(fee)
          $scope.data.amount = sendableBalance > 0 ? sendableBalance : 0
        }
        // Set the balance with the default fees while updating it with the real fees
        setBalance(accountService.defaultFees.send)
        accountService.getFees(true).then((fees) => {
          if (fees.send !== accountService.defaultFees.send) {
            setBalance(fees.send)
          }
        })
      }

      $scope.onQrCodeForToAddressScanned = address => {
        // This triggers the `selectedContactChange` function, which sets the `toAddress`
        $scope.data.selectedAddress = { address }
      }

      /* Auto-complete */

      $scope.querySearch = text => {
        text = text.toLowerCase()

        const accounts = accountCtrl.getAllAccounts()
        let contacts = storageService.get('contacts') || []

        contacts = contacts.concat(accounts).sort((a, b) => {
          if (a.name && b.name) return a.name < b.name
          else if (a.username && b.username) return a.username < b.username
          else if (a.username && b.name) return a.username < b.name
          else if (a.name && b.username) return a.name < b.username
        })

        return contacts.filter(account => {
          return (account.address.toLowerCase().indexOf(text) > -1) || (account.name && (account.name.toLowerCase().indexOf(text) > -1))
        })
      }

      $scope.checkContacts = input => {
        if (input[0] !== '@') return true
      }

      $scope.searchTextChange = text => {
        $scope.data.toAddress = { address: text }
      }

      $scope.selectedContactChange = contact => {
        if (contact) {
          $scope.data.toAddress = contact.address
        }
      }

      openDialog('./src/components/account/templates/send-transaction-dialog.html')
    }

    return {
      openDialogIn,
    }
  }

})()
