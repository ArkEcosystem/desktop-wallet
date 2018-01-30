;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('ledgerService', ['$q', '$http', '$timeout', 'storageService', 'networkService', LedgerService])

  /**
   * NetworkService
   * @constructor
   */
  function LedgerService ($q, $http, $timeout, storageService, networkService) {
    const _path = require('path')

    const ipcRenderer = require('electron').ipcRenderer
    const arkjs = require(_path.resolve(__dirname, '../node_modules/arkjs'))
    const bip39 = require(_path.resolve(__dirname, '../node_modules/bip39'))
    const async = require('async')

    function deriveAddress (path) {
      const result = ipcRenderer.sendSync('ledger', {
        action: 'getAddress',
        path
      })
      return result
    }

    function getBip44Accounts (slip44) {
      const deferred = $q.defer()
      const accounts = []
      let accountIndex = 0
      const addressIndex = 0
      const path = `44'/${slip44 || '111'}'/`
      let empty = false

      async.whilst(
        () => {
          return !empty
        },
        (next) => {
          const localpath = `${path}${accountIndex}'/0/${addressIndex}`
          const result = ipcRenderer.sendSync('ledger', {
            action: 'getAddress',
            path: localpath
          })
          if (result.address) {
            result.address = arkjs.crypto.getAddress(result.publicKey)
            accountIndex = accountIndex + 1
            const account = storageService.get(result.address) || result
            account.ledger = localpath
            const txs = storageService.get('transactions-' + account.address)
            account.cold = !txs || txs.length === 0
            account.publicKey = result.publicKey
            storageService.set(account.address, account)
            account.virtual = storageService.get('virtual-' + account.address) || []
            storageService.set('virtual-' + account.address, account.virtual)
            accounts.push(account)
            if (account.cold) {
              networkService.getFromPeer('/api/transactions?orderBy=timestamp:desc&limit=1&recipientId=' + account.address + '&senderId=' + account.address).then(
                (resp) => {
                  if (resp.success) {
                    empty = parseInt(resp.count) === 0
                    next()
                  } else {
                    empty = true
                    next()
                  }
                },
                () => {
                  empty = true
                  next()
                }
              )
            } else {
              next()
            }
          } else {
            empty = true
            next()
          }
        },
        (err) => {
          if (err) {
            deferred.reject(err)
          } else {
            deferred.resolve(accounts)
          }
        }
      )

      return deferred.promise
    }

    function recoverBip44Accounts (backupLedgerPassphrase, slip44) {
      const hdnode = arkjs.HDNode.fromSeedHex(bip39.mnemonicToSeedHex(backupLedgerPassphrase))

      const accounts = []
      let accountIndex = 0
      const addressIndex = 0
      const path = `44'/${slip44 || '111'}'/`
      let empty = false

      while (!empty) {
        const localpath = `${path}${accountIndex}'/0/${addressIndex}`
        const keys = hdnode.derivePath(localpath).keyPair
        const address = keys.getAddress()
        accountIndex = accountIndex + 1
        const account = storageService.get(address)

        if (account && !account.cold) {
          account.ledger = localpath
          storageService.set(address, account)
          accounts.push(account)
        } else {
          const result = {
            address,
            publicKey: keys.getPublicKeyBuffer().toString('hex'),
            ledger: localpath,
            cold: true
          }
          storageService.set(address, result)
          accounts.push(result)
          empty = true
        }
      }
      return accounts
    }

    function signTransaction (path, transaction) {
      return new Promise((resolve, reject) => {
        ipcRenderer.once('transactionSigned', (event, result) => {
          result.error ? reject(result.error) : resolve(result)
        })

        ipcRenderer.send('ledger', {
          action: 'signTransaction',
          data: arkjs.crypto.getBytes(transaction, true, true).toString('hex'),
          path
        })
      })
    }

    function signMessage (path, message) {
      return new Promise((resolve, reject) => {
        let hash = require('crypto').createHash('sha256')
        hash = hash.update(Buffer.from(message, 'utf-8')).digest()

        ipcRenderer.once('messageSigned', (event, result) => {
          result.error ? reject(result.error) : resolve(result)
        })

        ipcRenderer.send('ledger', {
          action: 'signMessage',
          data: hash.toString('hex'),
          path
        })
      })
    }

    function detect () {
      const result = ipcRenderer.sendSync('ledger', {
        action: 'detect'
      })
      return result
    }

    function isAppLaunched () {
      const result = ipcRenderer.sendSync('ledger', {
        action: 'getConfiguration'
      })
      return result
    }

    return {
      deriveAddress,
      signTransaction,
      signMessage,
      detect,
      isAppLaunched,
      getBip44Accounts,
      recoverBip44Accounts
    }
  }
})()
