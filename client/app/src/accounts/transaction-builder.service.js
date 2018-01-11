;(function () {
  'use strict'

  // TODO refactor

  angular.module('arkclient.accounts')
    .service('transactionBuilderService', ['$q', 'networkService', 'accountService', 'ledgerService', 'gettextCatalog', 'utilityService', TransactionBuilderService])

  function TransactionBuilderService ($q, networkService, accountService, ledgerService, gettextCatalog, utilityService) {
    const ark = require(require('path').resolve(__dirname, '../node_modules/arkjs'))

    function createTransaction (deferred, config, fee, createTransactionFunc, setAdditionalTransactionPropsOnLedger) {
      let transaction
      try {
        transaction = createTransactionFunc(config)
      } catch (e) {
        deferred.reject(e)
        return
      }

      if (config.ledger) {
        delete transaction.signature
        transaction.senderPublicKey = config.publicKey
        if (setAdditionalTransactionPropsOnLedger) {
          setAdditionalTransactionPropsOnLedger(transaction)
        }
        ledgerService.signTransaction(config.ledger, transaction).then((result) => {
          transaction.signature = result.signature
          transaction.id = ark.crypto.getId(transaction)
          deferred.resolve(transaction)
        },
        (error) => deferred.reject(error))
        return
      }

      if (ark.crypto.getAddress(transaction.senderPublicKey, networkService.getNetwork().version) !== config.fromAddress) {
        deferred.reject(gettextCatalog.getString('Passphrase is not corresponding to account ') + config.fromAddress)
        return
      }

      transaction.fee = fee
      transaction.senderId = config.fromAddress

      deferred.resolve(transaction)
    }

    function prepareTransaction (config, prepareFunc) {
      const deferred = $q.defer()
      const account = accountService.getAccount(config.fromAddress)
      accountService.getFees(false).then((fees) => {
        prepareFunc(deferred, account, fees)
      })
      return deferred.promise
    }

    function createSendTransaction (config) {
      return prepareTransaction(config, (deferred, account, fees) => {
        if (!ark.crypto.validateAddress(config.toAddress, networkService.getNetwork().version)) {
          deferred.reject(gettextCatalog.getString('The destination address ') + config.toAddress + gettextCatalog.getString(' is erroneous'))
          return
        }

        if (config.amount + fees.send > account.balance) {
          deferred.reject(gettextCatalog.getString('Not enough ' + networkService.getNetwork().token + ' on your account ') + config.fromAddress)
          return
        }

        createTransaction(deferred,
                          config,
                          fees.send,
                          () => ark.transaction.createTransaction(config.toAddress,
                                                                  config.amount,
                                                                  config.smartbridge,
                                                                  config.masterpassphrase,
                                                                  config.secondpassphrase))
      })
    }

    /**
     * Each transaction is expected to be ``{ address, amount, smartbridge }`,
     * where amount is expected to be in arktoshi
     */
    function createMultipleSendTransactions ({ publicKey, fromAddress, transactions, masterpassphrase, secondpassphrase }) {
      const network = networkService.getNetwork()
      const account = accountService.getAccount(fromAddress)

      return new Promise((resolve, reject) => {
        accountService.getFees(false).then(fees => {

          const invalidAddress = transactions.find(t => {
            return !ark.crypto.validateAddress(t.address, network.version)
          })

          if (invalidAddress) {
            return reject(gettextCatalog.getString('The destination address ') + invalidAddress + gettextCatalog.getString(' is erroneous'))
          }

          const total = transactions.reduce((total, t) => total + t.amount + fees.send, 0)
          if (total > account.balance) {
            return reject(gettextCatalog.getString('Not enough ' + network.token + ' on your account ') + fromAddress)
          }

          if (ark.crypto.getAddress(publicKey, network.version) !== fromAddress) {
            return reject(gettextCatalog.getString('Passphrase is not corresponding to account ') + fromAddress)
          }

          transactions = transactions.map(({ address, amount, smartbridge }) => {
            const transaction = ark.transaction.createTransaction(address, amount, smartbridge, masterpassphrase, secondpassphrase)

            // TODO ledger signing on each transaction

            transaction.fee = fees.send
            transaction.senderId = fromAddress

            return transaction
          })

          resolve(transactions)
        })
      })
    }

    function createSecondPassphraseCreationTransaction (config) {
      return prepareTransaction(config, (deferred, account, fees) => {
        if (account.balance < fees.secondsignature) {
          deferred.reject(gettextCatalog.getString('Not enough ' + networkService.getNetwork().token + ' on your account ') + config.fromAddress +
                          ', ' + gettextCatalog.getString('you need at least ' + arktoshiToArk(fees.secondsignature) + ' to create a second passphrase'))
          return
        }

        createTransaction(deferred,
                          config,
                          fees.secondsignature,
                          () => ark.signature.createSignature(config.masterpassphrase, config.secondpassphrase))
      })
    }

    function createDelegateCreationTransaction (config) {
      return prepareTransaction(config, (deferred, account, fees) => {
        if (account.balance < fees.delegate) {
          deferred.reject(gettextCatalog.getString('Not enough ' + networkService.getNetwork().token + ' on your account ') + config.fromAddress + ', ' +
                          gettextCatalog.getString('you need at least ' + arktoshiToArk(fees.delegate) + ' to register delegate'))
          return
        }

        createTransaction(deferred,
                          config,
                          fees.delegate,
                          () => ark.delegate.createDelegate(config.masterpassphrase, config.username, config.secondpassphrase))
      })
    }

    function createVoteTransaction (config) {
      return prepareTransaction(config, (deferred, account, fees) => {
        if (account.balance < fees.vote) {
          deferred.reject(gettextCatalog.getString('Not enough ' + networkService.getNetwork().token + ' on your account ') + config.fromAddress +
                           ', ' + gettextCatalog.getString('you need at least ' + arktoshiToArk(fees.vote) + ' to vote'))
          return
        }

        createTransaction(deferred,
                          config,
                          fees.vote,
                          () => ark.vote.createVote(config.masterpassphrase, config.publicKeys.split(','), config.secondpassphrase),
                          (transaction) => { transaction.recipientId = config.fromAddress })
      })
    }

    function arktoshiToArk (value) {
      return utilityService.arktoshiToArk(value) + ' ' + networkService.getNetwork().token
    }

    return {
      createSendTransaction,
      createMultipleSendTransactions,
      createSecondPassphraseCreationTransaction,
      createDelegateCreationTransaction,
      createVoteTransaction
    }
  }
})()
