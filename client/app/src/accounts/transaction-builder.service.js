;(function () {
  'use strict'

  angular.module('arkclient.accounts')
    .service('transactionBuilderService', ['$timeout', '$q', 'networkService', 'accountService', 'ledgerService', 'gettextCatalog', 'utilityService', TransactionBuilderService])

  function TransactionBuilderService ($timeout, $q, networkService, accountService, ledgerService, gettextCatalog, utilityService) {
    const ark = require(require('path').resolve(__dirname, '../node_modules/arkjs'))

    function createTransaction (deferred, config, fee, createTransactionFunc, setAdditionalTransactionPropsOnLedger) {
      let transaction
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
        ledgerService.signTransaction(config.ledger, transaction)
          .then(({ signature }) => {
            transaction.signature = signature
            transaction.id = ark.crypto.getId(transaction)
            deferred.resolve(transaction)
          })
          .catch(error => {
            console.error(error)
            deferred.reject(error)
          })

        return
      }

      if (ark.crypto.getAddress(transaction.senderPublicKey, networkService.getNetwork().version) !== config.fromAddress) {
        deferred.reject(gettextCatalog.getString('Passphrase is not corresponding to account \'{{ address }}\'', {address: config.fromAddress}))
        return
      }

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
        if (!accountService.isValidAddress(config.toAddress)) {
          deferred.reject(gettextCatalog.getString('The destination address \'{{ address }}\' is erroneous', {address: config.toAddress}))
          return
        }

        if (config.amount + fees.send > account.balance) {
          deferred.reject(gettextCatalog.getString('Not enough {{ currency }} on your account \'{{ address }}\'!', {currency: networkService.getNetwork().token, address: config.fromAddress}))
          return
        }

        createTransaction(deferred,
                          config,
                          fees.send,
                          () => ark.transaction.createTransaction(config.toAddress,
                                                                  config.amount,
                                                                  config.smartbridge,
                                                                  config.masterpassphrase,
                                                                  config.secondpassphrase,
                                                                  undefined,
                                                                  fees.send))
      })
    }

    /**
     * Each transaction is expected to be `{ address, amount, smartbridge }`,
     * where amount is expected to be in arktoshi
     */
    function createMultipleSendTransactions ({ publicKey, fromAddress, transactions, masterpassphrase, secondpassphrase, ledger }) {
      const network = networkService.getNetwork()
      const account = accountService.getAccount(fromAddress)

      return new Promise((resolve, reject) => {
        accountService.getFees(false).then(fees => {
          const invalidAddress = transactions.find(t => {
            return !ark.crypto.validateAddress(t.address, network.version)
          })

          if (invalidAddress) {
            return reject(new Error(gettextCatalog.getString('The destination address \'{{ address }}\' is erroneous', {address: invalidAddress})))
          }

          const total = transactions.reduce((total, t) => total + t.amount + fees.send, 0)
          if (total > account.balance) {
            return reject(new Error(gettextCatalog.getString(
              'Not enough {{ currency }} on your account \'{{ address }}\' you need at least {{ amount }} to send your transactions!',
            {
              currency: network.token,
              address: fromAddress,
              amount: total
            })))
          }

          const processed = Promise.all(
            transactions.map(({ address, amount, smartbridge }, i) => {
              return new Promise((resolve, reject) => {
                const transaction = ark.transaction.createTransaction(address, amount, smartbridge, masterpassphrase, secondpassphrase, undefined, fees.send)

                transaction.fee = fees.send
                transaction.senderId = fromAddress

                if (ledger) {
                  $timeout(transaction => {
                    delete transaction.signature
                    transaction.senderPublicKey = publicKey

                    // Wait a little just in case
                    ledgerService.signTransaction(ledger, transaction)
                      .then(({ signature }) => {
                        transaction.signature = signature
                        transaction.id = ark.crypto.getId(transaction)
                        resolve(transaction)
                      })
                      .catch(error => {
                        console.error(error)
                        reject(error)
                      })
                  }, 2000 * i, true, transaction)
                } else {
                  if (ark.crypto.getAddress(transaction.senderPublicKey, network.version) !== fromAddress) {
                    return reject(new Error(gettextCatalog.getString('Passphrase is not corresponding to account \'{{ address }}\'', {address: fromAddress})))
                  }

                  resolve(transaction)
                }
              })
            })
          )

          processed
            .then(resolve)
            .catch(reject)
        })
      })
    }

    function createSecondPassphraseCreationTransaction (config) {
      return prepareTransaction(config, (deferred, account, fees) => {
        if (account.balance < fees.secondsignature) {
          deferred.reject(gettextCatalog.getString(
              'Not enough {{ currency }} on your account \'{{ address }}\' you need at least {{ amount }} to create a second passphrase!',
              {
                currency: networkService.getNetwork().token,
                address: config.fromAddress,
                amount: arktoshiToArk(fees.secondsignature)
              }
          ))
          return
        }

        createTransaction(deferred,
                          config,
                          fees.secondsignature,
                          () => ark.signature.createSignature(config.masterpassphrase, config.secondpassphrase, fees.secondsignature))
      })
    }

    function createDelegateCreationTransaction (config) {
      return prepareTransaction(config, (deferred, account, fees) => {
        if (account.balance < fees.delegate) {
          deferred.reject(gettextCatalog.getString(
            'Not enough {{ currency }} on your account \'{{ address }}\' you need at least {{ amount }} to register delegate!',
            {
              currency: networkService.getNetwork().token,
              address: config.fromAddress,
              amount: arktoshiToArk(fees.delegate)
            }
          ))
          return
        }

        createTransaction(deferred,
                          config,
                          fees.delegate,
                          () => ark.delegate.createDelegate(config.masterpassphrase, config.username, config.secondpassphrase, fees.delegate))
      })
    }

    function createVoteTransaction (config) {
      return prepareTransaction(config, (deferred, account, fees) => {
        if (account.balance < fees.vote) {
          deferred.reject(gettextCatalog.getString(
            'Not enough {{ currency }} on your account \'{{ address }}\' you need at least {{ amount }} to vote!',
            {
              currency: networkService.getNetwork().token,
              address: config.fromAddress,
              amount: arktoshiToArk(fees.vote)
            }
          ))
          return
        }

        createTransaction(deferred,
                          config,
                          fees.vote,
                          () => ark.vote.createVote(config.masterpassphrase, config.publicKeys.split(','), config.secondpassphrase, fees.vote),
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
