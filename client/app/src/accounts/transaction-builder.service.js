;(function () {
  'use strict'

  angular.module('arkclient.accounts')
    .service('transactionBuilderService', ['$q', 'networkService', 'accountService', 'ledgerService', 'gettextCatalog', TransactionBuilderService])

  /**
   * TransactionBuilderService
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function TransactionBuilderService ($q, networkService, accountService, ledgerService, gettextCatalog) {
    var ark = require('../node_modules/arkjs')

    function createTransaction (deferred, config, fee, createTransactionFunc, setAdditionalTransactionPropsOnLedger) {
      var transaction
      try {
        transaction = createTransactionFunc(config)
      } catch (e) {
        deferred.reject(e)
        return
      }

      transaction.fee = fee
      transaction.senderId = config.fromAddress

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
      deferred.resolve(transaction)
    }

    function prepareTransaction (config, prepareFunc) {
      var deferred = $q.defer()
      var account = accountService.getAccount(config.fromAddress)
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

    function createSecondPassphraseCreationTransaction (config) {
      return prepareTransaction(config, (deferred, account, fees) => {
        if (account.balance < fees.secondsignature) {
          deferred.reject(gettextCatalog.getString('Not enough ' + networkService.getNetwork().token + ' on your account ') + config.fromAddress +
                          ', ' + gettextCatalog.getString('you need at least ' + accountService.arkToshiToArk(fees.secondsignature, true) + ' to create a second passphrase'))
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
                          gettextCatalog.getString('you need at least ' + accountService.arkToshiToArk(fees.delegate, true) + ' to register delegate'))
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
                           ', ' + gettextCatalog.getString('you need at least ' + accountService.arkToshiToArk(fees.vote, true) + ' to vote'))
          return
        }

        createTransaction(deferred,
                          config,
                          fees.vote,
                          () => ark.vote.createVote(config.masterpassphrase, config.publicKeys.split(','), config.secondpassphrase),
                          (transaction) => { transaction.recipientId = config.fromAddress })
      })
    }

    return {
      createSendTransaction: createSendTransaction,

      createSecondPassphraseCreationTransaction: createSecondPassphraseCreationTransaction,

      createDelegateCreationTransaction: createDelegateCreationTransaction,

      createVoteTransaction: createVoteTransaction
    }
  }
})()
