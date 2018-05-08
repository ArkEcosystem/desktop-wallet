;(function () {
  'use strict'

  angular.module('arkclient.accounts')
    .service('accountService', ['$q', '$http', 'networkService', 'storageService', 'ledgerService', 'gettextCatalog', 'gettext', 'utilityService', 'ARK_LAUNCH_DATE', AccountService])

  /**
   * Accounts DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function AccountService ($q, $http, networkService, storageService, ledgerService, gettextCatalog, gettext, utilityService, ARK_LAUNCH_DATE) {
    const self = this
    const ark = require(require('path').resolve(__dirname, '../node_modules/arkjs'))

    self.defaultFees = {
      'send': 10000000,
      'vote': 100000000,
      'secondsignature': 500000000,
      'delegate': 2500000000,
      'multisignature': 500000000
    }

    self.cachedFees = null

    self.TxTypes = {
      0: gettext('Send {{ currency }}'),
      1: gettext('Second Signature Creation'),
      2: gettext('Delegate Registration'),
      3: gettext('Vote'),
      4: gettext('Multisignature Creation')
    }

    self.peer = networkService.getPeer().ip

    function showTimestamp (timestamp) { // eslint-disable-line no-unused-vars
      const date = utilityService.arkStampToDate(timestamp)

      const currentTime = new Date().getTime()
      const diffTime = (currentTime - date.getTime()) / 1000

      if (diffTime < 60) {
        return Math.floor(diffTime) + ' sec ago'
      }
      if (Math.floor(diffTime / 60) <= 1) {
        return Math.floor(diffTime / 60) + ' min ago'
      }
      if ((diffTime / 60) < 60) {
        return Math.floor(diffTime / 60) + ' mins ago'
      }
      if (Math.floor(diffTime / 60 / 60) <= 1) {
        return Math.floor(diffTime / 60 / 60) + ' hour ago'
      }
      if ((diffTime / 60 / 60) < 24) {
        return Math.floor(diffTime / 60 / 60) + ' hours ago'
      }
      if (Math.floor(diffTime / 60 / 60 / 24) <= 1) {
        return Math.floor(diffTime / 60 / 60 / 24) + ' day ago'
      }
      if ((diffTime / 60 / 60 / 24) < 30) {
        return Math.floor(diffTime / 60 / 60 / 24) + ' days ago'
      }
      if (Math.floor(diffTime / 60 / 60 / 24 / 30) <= 1) {
        return Math.floor(diffTime / 60 / 60 / 24 / 30) + ' month ago'
      }
      if ((diffTime / 60 / 60 / 24 / 30) < 12) {
        return Math.floor(diffTime / 60 / 60 / 24 / 30) + ' months ago'
      }
      if (Math.floor((diffTime / 60 / 60 / 24 / 30 / 12)) <= 1) {
        return Math.floor(diffTime / 60 / 60 / 24 / 30 / 12) + ' year ago'
      }

      return Math.floor(diffTime / 60 / 60 / 24 / 30 / 12) + ' years ago'
    }

    function fetchAccount (address) {
      const deferred = $q.defer()
      const defaultAccount = {
        address: address,
        balance: 0,
        secondSignature: false,
        cold: true,
        delegates: [],
        selectedVotes: []
      }
      networkService.getFromPeer('/api/accounts?address=' + address).then(
        (resp) => {
          if (resp.success) {
            const account = resp.account
            account.cold = !account.publicKey
            account.delegates = []
            account.selectedVotes = []
            deferred.resolve(account)
            addWatchOnlyAddress(account)
          } else {
            deferred.resolve(defaultAccount)
            addWatchOnlyAddress(defaultAccount)
          }
        },
        () => {
          deferred.resolve(defaultAccount)
          addWatchOnlyAddress(defaultAccount)
        }
      )
      return deferred.promise
    }

    function fetchAccountAndForget (address) {
      const deferred = $q.defer()
      networkService.getFromPeer('/api/accounts?address=' + address).then(
        (resp) => {
          if (resp.success) {
            let account = storageService.get(address)
            if (!account) {
              account = resp.account
            } else {
              account.balance = resp.account.balance
              account.secondSignature = resp.account.secondSignature
            }
            account.cold = !resp.account.publicKey
            deferred.resolve(account)
          } else {
            let account = storageService.get(address)
            if (!account) {
              account = {
                address: address,
                balance: 0,
                secondSignature: false,
                cold: true
              }
            } else {
              account.username = storageService.get('username-' + address)
            }
            deferred.resolve(account)
          }
        }
      )
      return deferred.promise
    }

    function getAccount (address) {
      const account = storageService.get(address)
      if (account) {
        account.transactions = storageService.get('transactions-' + address)
        account.username = storageService.get('username-' + address)
        account.delegate = storageService.get('delegate-' + address)
        account.virtual = getVirtual(address)
      }
      return account
    }

    function createAccount (passphrase) {
      return new Promise((resolve, reject) => {
        const publicKey = ark.crypto.getKeys(passphrase).publicKey
        const address = ark.crypto.getAddress(publicKey, networkService.getNetwork().version)

        fetchAccount(address).then(account => {
          if (account) {
            account.virtual = account.virtual || {}
            storageService.set('virtual-' + address, account.virtual)
            resolve(account)
          } else {
            reject(gettextCatalog.getString('Passphrase does not match your address'))
          }
        })
      })
    }

    function addWatchOnlyAddress (account) {
      if (!account || !account.address || storageService.get(account.address) || account.ledger) {
        return
      }
      storageService.set(account.address, account)
      let addresses = storageService.get('addresses')
      if (!addresses) {
        addresses = []
      }
      if (addresses.indexOf(account.address) === -1) {
        addresses.push(account.address)
        storageService.set('addresses', addresses)
      }
    }

    function removeAccount (account) {
      if (!account || !account.address) {
        return $q.when(null)
      }
      // delete account data
      storageService.set(account.address, null)
      storageService.set('transactions-' + account.address, null)
      storageService.set('voters-' + account.address, null)
      storageService.set('username-' + account.address, null)
      storageService.set('virtual-' + account.address, null)

      // remove the address from stored addresses
      const addresses = storageService.get('addresses')
      addresses.splice(addresses.indexOf(account.address), 1)
      storageService.set('addresses', addresses)
      return $q.when(account)
    }

    function getTransactionLabel (transaction, recipientAddress = null) {
      let label = gettextCatalog.getString(self.TxTypes[transaction.type], { currency: networkService.getNetwork().token })

      if (recipientAddress && transaction.recipientId === recipientAddress && transaction.type === 0) {
        label = gettextCatalog.getString('Receive {{ currency }}', { currency: networkService.getNetwork().token })
      }

      return label
    }

    function formatTransaction (transaction, recipientAddress) {
      transaction.label = getTransactionLabel(transaction, recipientAddress)
      transaction.date = utilityService.arkStampToDate(transaction.timestamp)
      if (transaction.recipientId === recipientAddress) {
        transaction.total = transaction.amount
      // if (transaction.type == 0) {
      //   transaction.label = gettextCatalog.getString("Receive Ark")
      // }
      }
      if (transaction.senderId === recipientAddress) {
        transaction.total = -transaction.amount - transaction.fee
      }
      // to avoid small transaction to be displayed as 1e-8
      transaction.humanTotal = utilityService.arktoshiToArk(transaction.total) + ''

      return transaction
    }

    function getFees (canUseCached) {
      const deferred = $q.defer()
      if (canUseCached && self.cachedFees) {
        deferred.resolve(self.cachedFees)
        return deferred.promise
      }

      networkService.getFromPeer('/api/blocks/getFees')
        .then((resp) => {
          if (resp.success) {
            self.cachedFees = resp.fees
            deferred.resolve(resp.fees)
          } else {
            deferred.resolve(self.defaultFees)
          }
        },
          () => deferred.resolve(self.defaultFees))

      return deferred.promise
    }

    function getTransactions (address, offset, limit, store) {
      if (!offset) {
        offset = 0
      }
      if (!limit) {
        limit = 50
      }
      if (!store) {
        store = true
      }
      const deferred = $q.defer()
      networkService.getFromPeer('/api/transactions?orderBy=timestamp:desc&offset=' + offset + '&limit=' + limit + '&recipientId=' + address + '&senderId=' + address).then((resp) => {
        if (resp.success) {
          for (let i = 0; i < resp.transactions.length; i++) {
            formatTransaction(resp.transactions[i], address)
          }
          if (store) storageService.set('transactions-' + address, resp.transactions)

          deferred.resolve(resp.transactions)
        } else {
          deferred.reject(gettextCatalog.getString('Cannot get transactions'))
        }
      }, () => {
        deferred.reject(gettextCatalog.getString('Cannot get transactions'))
      }, () => {
        deferred.notify(true)
      })
      return deferred.promise
    }

    // this methods only works correctly, as long as getAllTransactions returns the transactions ordered by new to old!
    function getRangedTransactions (address, startDate, endDate, onUpdate) {
      const startStamp = utilityService.dateToArkStamp(!startDate ? ARK_LAUNCH_DATE : startDate)
      const endStamp = utilityService.dateToArkStamp(!endDate ? new Date(new Date().setHours(23, 59, 59, 59)) : endDate)

      const deferred = $q.defer()

      let transactions = []
      function onRangeUpdate (updateObj) {
        const resultObj = {
          transactions: []
        }

        let isAnyTransactionTooOld = false
        updateObj.transactions.forEach(t => {
          if (t.timestamp >= startStamp && t.timestamp <= endStamp) {
            resultObj.transactions.push(t)
          }
          isAnyTransactionTooOld |= t.timestamp < startStamp
        })

        transactions = transactions.concat(resultObj.transactions)

        // if any transaction of the current set is already older than our start date, we are finished
        if (isAnyTransactionTooOld) {
          resultObj.isFinished = true
        }

        if (onUpdate) {
          onUpdate(resultObj)
        }

        if (resultObj.isFinished || updateObj.isFinished) {
          deferred.resolve(transactions)
          return true
        }
      }

      getAllTransactions(address, null, onRangeUpdate)
        .catch(error => deferred.reject({message: error.message, transactions: transactions}))

      return deferred.promise
    }

    function getAllTransactions (address, totalLimit, onUpdate, offset, transactionCollection, deferred) {
      if (!transactionCollection) {
        transactionCollection = []
      }

      if (!offset) {
        offset = 0
      }

      if (!totalLimit) {
        totalLimit = Number.MAX_VALUE
      }

      if (!deferred) {
        deferred = $q.defer()
      }

      getTransactions(address, offset).then(transactions => {
        const previousLength = transactionCollection.length
        transactionCollection = transactionCollection.concat(transactions)
        const updateObj = {
          transactions: transactions.slice(0, totalLimit - previousLength),
          isFinished: !transactions.length || transactionCollection.length >= totalLimit
        }

        transactionCollection = transactionCollection.slice(0, totalLimit)

        if (onUpdate) {
          if (onUpdate(updateObj)) {
            deferred.resolve(transactionCollection)
            return
          }
        }

        if (updateObj.isFinished) {
          deferred.resolve(transactionCollection)
          return
        }

        getAllTransactions(address, totalLimit, onUpdate, offset + transactions.length, transactionCollection, deferred)
      }).catch(error => deferred.reject({message: error, transactions: transactionCollection}))

      return deferred.promise
    }

    function isValidAddress (address) {
      return ark.crypto.validateAddress(address, networkService.getNetwork().version)
    }

    function getDelegate (publicKey) {
      const deferred = $q.defer()
      if (!publicKey) {
        deferred.reject(gettextCatalog.getString('No publicKey'))
        return deferred.promise
      }
      networkService.getFromPeer('/api/delegates/get/?publicKey=' + publicKey).then((resp) => {
        if (resp && resp.success && resp.delegate) {
          storageService.set('delegate-' + resp.delegate.address, resp.delegate)
          storageService.set('username-' + resp.delegate.address, resp.delegate.username)
          deferred.resolve(resp.delegate)
        } else {
          deferred.reject(gettextCatalog.getString('Cannot state if account is a delegate'))
        }
      })
      return deferred.promise
    }

    function getActiveDelegates () {
      const deferred = $q.defer()
      networkService.getFromPeer('/api/delegates').then((resp) => {
        if (resp && resp.success && resp.delegates) {
          deferred.resolve(resp.delegates)
        } else {
          deferred.reject(gettextCatalog.getString('Cannot get registered delegates'))
        }
      }).catch(() => {
        deferred.reject(gettextCatalog.getString('Cannot get registered delegates'))
      })
      return deferred.promise
    }

    function getDelegateByUsername (username) {
      const deferred = $q.defer()
      if (!username) {
        deferred.reject('No Username')
        return deferred.promise
      }
      username = username.toLowerCase()
      networkService.getFromPeer('/api/delegates/get/?username=' + username).then((resp) => {
        if (resp && resp.success && resp.delegate) {
          storageService.set('delegate-' + resp.delegate.address, resp.delegate)
          storageService.set('username-' + resp.delegate.address, resp.delegate.username)
          deferred.resolve(resp.delegate)
        } else {
          deferred.reject(gettextCatalog.getString('Cannot find delegate: {{ delegateName }}', {delegateName: username}))
        }
      })
      return deferred.promise
    }

    // TODO: NOT working yet, waiting for 0.3.2
    function searchDelegates (term) { // eslint-disable-line no-unused-vars
      const deferred = $q.defer()
      if (!term) {
        deferred.reject(gettextCatalog.getString('No search term'))
        return deferred.promise
      }
      networkService.getFromPeer('/api/delegates/search/?term=' + term).then((resp) => {
        if (resp && resp.success && resp.delegates) {
          deferred.resolve(resp.delegates)
        } else {
          deferred.reject(gettextCatalog.getString('Cannot find any delegate using the search term \'{{ searchTerm }}\'!', {searchTerm: term}))
        }
      }, (err) => {
        deferred.reject(gettextCatalog.getString('An error occurred when searching for delegates:') + err)
      })
      return deferred.promise
    }

    function getVotedDelegates (address) {
      const deferred = $q.defer()
      networkService.getFromPeer('/api/accounts/delegates/?address=' + address).then((resp) => {
        if (resp && resp.success) {
          let delegates = []
          if (resp.delegates && resp.delegates.length && resp.delegates[0]) {
            delegates = resp.delegates
          }
          storageService.set('voted-' + address, delegates)
          deferred.resolve(delegates)
        } else {
          deferred.reject(gettextCatalog.getString('Cannot get voted delegates'))
        }
      })
      return deferred.promise
    }

    function verifyMessage (message, publicKey, signature) {
      // check for hexadecimal, otherwise the signature check would may fail
      const re = /[0-9A-Fa-f]{6}/g
      if (!re.test(publicKey) || !re.test(signature)) {
        // return here already because the process will fail otherwise
        return gettextCatalog.getString('Error in your input.')
      }
      const crypto = require('crypto')
      let hash = crypto.createHash('sha256')
      hash = hash.update(Buffer.from(message, 'utf-8')).digest()
      const ecpair = ark.ECPair.fromPublicKeyBuffer(Buffer.from(publicKey, 'hex'))
      const ecsignature = ark.ECSignature.fromDER(Buffer.from(signature, 'hex'))
      const success = ecpair.verify(hash, ecsignature)

      if (success) {
        message = gettextCatalog.getString('The message is verified successfully')
      } else {
        message = gettextCatalog.getString('The message is NOT verified')
      }
      return message
    }

    function signMessage (message, passphrase) {
      const deferred = $q.defer()
      const crypto = require('crypto')
      let hash = crypto.createHash('sha256')
      hash = hash.update(Buffer.from(message, 'utf-8')).digest()
      const ecpair = ark.crypto.getKeys(passphrase)
      deferred.resolve({ signature: ecpair.sign(hash).toDER().toString('hex') })
      return deferred.promise
    }

    function signMessageWithLedger (message, path) {
      const deferred = $q.defer()
      ledgerService.signMessage(path, message).then(
        (result) => {
          deferred.resolve(result)
        },
        (error) => {
          deferred.reject(error)
        }
      )
      return deferred.promise
    }

    // Given a final list of delegates, create a vote assets list to be sent
    // return null if could not make it
    function createDiffVote (address, newdelegates) {
      function arrayObjectIndexOf (myArray, searchTerm, property) {
        for (let i = 0, len = myArray.length; i < len; i++) {
          if (myArray[i][property] === searchTerm) return i
        }
        return -1
      }

      const assets = []
      let votedDelegates = storageService.get('voted-' + address) || []
      votedDelegates = votedDelegates.map((delegate) => {
        return {
          username: delegate.username,
          address: delegate.address,
          publicKey: delegate.publicKey
        }
      })

      const delegates = newdelegates.map((delegate) => {
        return {
          username: delegate.username,
          address: delegate.address,
          publicKey: delegate.publicKey
        }
      })

      if (delegates.length > 101) {
        return null
      }
      let difflist = []
      const notRemovedDelegates = []
      for (const i in delegates) {
        const delegate = delegates[i]
        if (arrayObjectIndexOf(votedDelegates, delegate.publicKey, 'publicKey') === -1) {
          delegate.vote = '+'
          difflist.push(delegate)
        } else {
          notRemovedDelegates.push(delegate)
        }
        if (difflist.length === 33) {
          assets.push(difflist)
          difflist = []
        }
      }
      for (const j in votedDelegates) {
        const votedDelegate = votedDelegates[j]
        if (arrayObjectIndexOf(notRemovedDelegates, votedDelegate.publicKey, 'publicKey') === -1) {
          votedDelegate.vote = '-'
          difflist.push(votedDelegate)
        }
        if (difflist.length === 33) {
          assets.push(difflist)
          difflist = []
        }
      }
      if (difflist.length > 0) {
        assets.push(difflist)
      }
      console.log(assets)
      return assets
    }

    function getSponsors () {
      const deferred = $q.defer()
      const result = []
      $http.get('https://gist.githubusercontent.com/fix/a7b1d797be38b0591e725a24e6735996/raw/sponsors.json').then((resp) => {
        let count = 0
        for (const i in resp.data) {
          networkService.getFromPeer('/api/delegates/get/?publicKey=' + resp.data[i].publicKey).then((resp2) => {
            if (resp2.data && resp2.data.success && resp2.data.delegate) {
              result.push(resp2.data.delegate)
            }
            count++
            if (count === resp.data.length - 1) {
              deferred.resolve(result)
            }
          }, () => count++)
        }
      }, (err) => {
        console.log(err)
        deferred.reject(gettextCatalog.getString('Cannot get sponsors'))
      })
      return deferred.promise
    }

    function createVirtual (passphrase) {
      const deferred = $q.defer()
      const address = ark.crypto.getAddress(ark.crypto.getKeys(passphrase).publicKey, networkService.getNetwork().version)
      const account = getAccount(address)
      if (account) {
        account.virtual = account.virtual || {}
        storageService.set('virtual-' + address, account.virtual)
        deferred.resolve(account.virtual)
      } else {
        deferred.reject(gettextCatalog.getString('Passphrase does not match your address'))
      }

      return deferred.promise
    }

    function setToFolder (address, folder, amount) {
      const virtual = getVirtual(address)
      const f = virtual[folder]
      if (f && amount >= 0) {
        f.amount = amount
      } else if (!f && amount >= 0) {
        virtual[folder] = { amount: amount }
      }
      storageService.set('virtual-' + address, virtual)
      return getVirtual(address)
    }

    function deleteFolder (address, folder) {
      const virtual = storageService.get('virtual-' + address)
      delete virtual[folder]
      storageService.set('virtual-' + address, virtual)
      return getVirtual(address)
    }

    function renameFolder (address, folder, newFolder) {
      const virtual = storageService.get('virtual-' + address)
      virtual[newFolder] = virtual[folder]
      delete virtual[folder]
      storageService.set('virtual-' + address, virtual)
      return getVirtual(address)
    }

    function getVirtual (address) {
      const virtual = storageService.get('virtual-' + address)
      if (virtual) {
        virtual.uservalue = function (folder) {
          return function (value) {
            if (virtual[folder]) {
              if (arguments.length === 1) {
                if (value === null) {
                  virtual[folder].amount = null
                } else {
                  virtual[folder].amount = utilityService.arkToArktoshi(value)
                }
              } else {
                return virtual[folder].amount === null ? '' : utilityService.arktoshiToArk(virtual[folder].amount, true)
              }
            }
          }
        }
        virtual.getFolders = function () {
          const folders = []
          for (const i in virtual) {
            if (virtual.hasOwnProperty(i) && typeof virtual[i] !== 'function') {
              folders.push(i)
            }
          }
          return folders
        }
      }
      return virtual
    }

    const allowedDelegateNameChars = /^[a-z0-9!@$&_.]+$/

    function sanitizeDelegateName (delegateName) {
      if (!delegateName) {
        throw new Error('Delegate name is undefined')
      }
      if (delegateName !== delegateName.toLowerCase()) {
        throw new Error('Delegate name must be lowercase')
      }

      const sanitizedName = String(delegateName).toLowerCase().trim()
      if (sanitizedName === '') {
        throw new Error('Empty delegate name')
      }
      if (sanitizedName.length > 20) {
        throw new Error('Delegate name is too long, 20 characters maximum')
      }
      if (!allowedDelegateNameChars.test(sanitizedName)) {
        throw new Error('Delegate name can only contain alphanumeric characters with the exception of !@$&_.')
      }

      return sanitizedName
    }

    return {
      loadAllAccounts: function () {
        let accounts = storageService.get('addresses')

        if (!accounts) {
          return []
        }

        accounts = accounts.filter((a) => {
          return !a.ledger
        })

        const uniqueaccounts = []
        for (const i in accounts) {
          if (uniqueaccounts.indexOf(accounts[i]) === -1) {
            uniqueaccounts.push(accounts[i])
          }
        }
        accounts = uniqueaccounts
        accounts = accounts.filter((address) => {
          return (storageService.get('username-' + address) != null || storageService.get('virtual-' + address) != null) && !storageService.get(address).ledger
        })
        return accounts.map((address) => {
          const account = storageService.get(address)
          if (account) {
            account.transactions = storageService.get('transactions-' + address)
            account.delegate = storageService.get('delegate-' + address)
            account.username = storageService.get('username-' + address)
            account.virtual = getVirtual(address)
            return account
          }
          return { address }
        })
      },

      getAccount,

      refreshAccount: function (account) {
        return fetchAccount(account.address)
      },

      setUsername: function (address, username) {
        storageService.set('username-' + address, username)
      },

      getUsername: function (address) {
        return storageService.get('username-' + address) || address
      },

      addWatchOnlyAddress,

      createAccount,

      removeAccount,

      fetchAccount,

      fetchAccountAndForget,

      // return a copy of the object, so the original can't be changed
      defaultFees: JSON.parse(JSON.stringify(self.defaultFees)),

      getFees,

      getTransactions,

      getAllTransactions,

      getRangedTransactions,

      isValidAddress,

      verifyMessage,

      signMessage,

      signMessageWithLedger,

      createDiffVote,

      getVotedDelegates,

      getDelegate,

      getActiveDelegates,

      getDelegateByUsername,

      getSponsors,

      getTransactionLabel,

      createVirtual,

      setToFolder,

      deleteFolder,

      renameFolder,

      sanitizeDelegateName,

      formatTransaction
    }
  }
})()
