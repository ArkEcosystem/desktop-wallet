;(function () {
  'use strict'

  angular.module('arkclient.accounts')
    .service('accountService', ['$q', '$http', 'networkService', 'storageService', 'ledgerService', 'gettextCatalog', 'ARKTOSHI_UNIT', AccountService])

  /**
   * Accounts DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function AccountService ($q, $http, networkService, storageService, ledgerService, gettextCatalog, ARKTOSHI_UNIT) {
    var self = this
    var ark = require('../node_modules/arkjs')

    self.defaultFees = {
      'send': 10000000,
      'vote': ARKTOSHI_UNIT,
      'secondsignature': 500000000,
      'delegate': 2500000000,
      'multisignature': 500000000
    }

    self.TxTypes = {
      0: 'Send Ark',
      1: 'Second Signature Creation',
      2: 'Delegate Registration',
      3: 'Vote',
      4: 'Multisignature Creation'
    }

    self.peer = networkService.getPeer().ip

    function showTimestamp (time) {
      var d = new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0))

      var t = parseInt(d.getTime() / 1000)

      time = new Date((time + t) * 1000)

      var currentTime = new Date().getTime()
      var diffTime = (currentTime - time.getTime()) / 1000

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
      var deferred = $q.defer()
      var defaultAccount = {
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
            var account = resp.account
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
      var deferred = $q.defer()
      networkService.getFromPeer('/api/accounts?address=' + address).then(
        (resp) => {
          if (resp.success) {
            var account = storageService.get(address)
            if (!account) {
              account = resp.account
            } else {
              account.balance = resp.account.balance
              account.secondSignature = resp.account.secondSignature
            }
            account.cold = !resp.account.publicKey
            deferred.resolve(account)
          } else {
            account = storageService.get(address)
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

    function savePassphrases (address, passphrase, secondpassphrase) {
      var deferred = $q.defer()
      var tempaddress = ark.crypto.getAddress(ark.crypto.getKeys(passphrase).publicKey)
      if (passphrase) {
        var account = getAccount(tempaddress)
        if (account && account.address === address) {
          account.virtual = account.virtual || {}
          storageService.set('virtual-' + address, account.virtual)
          storageService.set('passphrase-' + address, passphrase)
          storageService.set('secondpassphrase-' + address, secondpassphrase)
          deferred.resolve(account)
        } else {
          deferred.reject(gettextCatalog.getString('Passphrase does not match your address'))
        }
      } else { // no passphrase, meaning remove all passphrases
        storageService.set('virtual-' + address, null)
        storageService.set('passphrase-' + address, null)
        storageService.set('secondpassphrase-' + address, null)
        deferred.reject(gettextCatalog.getString('Passphrases deleted'))
      }

      return deferred.promise
    }

    function getPassphrases (address) {
      var passphrases = [storageService.get('passphrase-' + address), storageService.get('secondpassphrase-' + address)]
      return passphrases
    }

    function addWatchOnlyAddress (account) {
      if (!account || !account.address || storageService.get(account.address) || account.ledger) {
        return
      }
      storageService.set(account.address, account)
      var addresses = storageService.get('addresses')
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
      storageService.set('passphrase-' + account.address, null)
      storageService.set('secondpassphrase-' + account.address, null)

      // remove the address from stored addresses
      var addresses = storageService.get('addresses')
      addresses.splice(addresses.indexOf(account.address), 1)
      storageService.set('addresses', addresses)
      return $q.when(account)
    }

    function getTransactionLabel (transaction, recipientAddress = null) {
      var label = gettextCatalog.getString(self.TxTypes[transaction.type])

      if (recipientAddress && transaction.recipientId === recipientAddress && transaction.type === 0) {
        label = gettextCatalog.getString('Receive Ark')
      }

      return label
    }

    function formatTransaction (transaction, recipientAddress) {
      var d = new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0))
      var t = parseInt(d.getTime() / 1000)

      transaction.label = getTransactionLabel(transaction, recipientAddress)
      transaction.date = new Date((transaction.timestamp + t) * 1000)
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
      transaction.humanTotal = numberToFixed(transaction.total / ARKTOSHI_UNIT) + ''

      return transaction
    }

    function getFees () {
      var deferred = $q.defer()
      networkService.getFromPeer('/api/blocks/getfees')
        .then((resp) => {
          if (resp.success) {
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
      var deferred = $q.defer()
      var d = new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0))
      var t = parseInt(d.getTime() / 1000)
      networkService.getFromPeer('/api/transactions?orderBy=timestamp:desc&offset=' + offset + '&limit=' + limit + '&recipientId=' + address + '&senderId=' + address).then(function (resp) {
        if (resp.success) {
          for (var i = 0; i < resp.transactions.length; i++) {
            formatTransaction(resp.transactions[i], address)
          }
          if (store) storageService.set('transactions-' + address, resp.transactions)

          deferred.resolve(resp.transactions)
        } else {
          deferred.reject(gettextCatalog.getString('Cannot get transactions'))
        }
      }, function () {
        deferred.reject(gettextCatalog.getString('Cannot get transactions'))
      }, function () {
        deferred.notify(true)
      })
      return deferred.promise
    }

    function getDelegate (publicKey) {
      var deferred = $q.defer()
      if (!publicKey) {
        deferred.reject(gettextCatalog.getString('No publicKey'))
        return deferred.promise
      }
      networkService.getFromPeer('/api/delegates/get/?publicKey=' + publicKey).then(function (resp) {
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
      var deferred = $q.defer()
      networkService.getFromPeer('/api/delegates').then(function (resp) {
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
      var deferred = $q.defer()
      if (!username) {
        deferred.reject('No Username')
        return deferred.promise
      }
      username = username.toLowerCase()
      networkService.getFromPeer('/api/delegates/get/?username=' + username).then(function (resp) {
        if (resp && resp.success && resp.delegate) {
          storageService.set('delegate-' + resp.delegate.address, resp.delegate)
          storageService.set('username-' + resp.delegate.address, resp.delegate.username)
          deferred.resolve(resp.delegate)
        } else {
          deferred.reject(gettextCatalog.getString('Cannot find delegate: ') + username)
        }
      })
      return deferred.promise
    }

    // TODO: NOT working yet, waiting for 0.3.2
    function searchDelegates (term) {
      var deferred = $q.defer()
      if (!term) {
        deferred.reject(gettextCatalog.getString('No search term'))
        return deferred.promise
      }
      networkService.getFromPeer('/api/delegates/search/?term=' + term).then(function (resp) {
        if (resp && resp.success && resp.delegates) {
          deferred.resolve(resp.delegates)
        } else {
          deferred.reject(gettextCatalog.getString('Cannot find delegates from this term: ') + term)
        }
      }, function (err) {
        deferred.reject(gettextCatalog.getString('Cannot find delegates on this peer: ') + err)
      })
      return deferred.promise
    }

    function getVotedDelegates (address) {
      var deferred = $q.defer()
      networkService.getFromPeer('/api/accounts/delegates/?address=' + address).then(function (resp) {
        if (resp && resp.success) {
          var delegates = []
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
      var re = /[0-9A-Fa-f]{6}/g
      if (!re.test(publicKey) || !re.test(signature)) {
        // return here already because the process will fail otherwise
        return gettextCatalog.getString('Error in your Input.')
      }
      var crypto = require('crypto')
      var hash = crypto.createHash('sha256')
      hash = hash.update(Buffer.from(message, 'utf-8')).digest()
      var ecpair = ark.ECPair.fromPublicKeyBuffer(Buffer.from(publicKey, 'hex'))
      var ecsignature = ark.ECSignature.fromDER(Buffer.from(signature, 'hex'))
      var success = ecpair.verify(hash, ecsignature)

      message = gettextCatalog.getString('Error in signature processing')
      if (success) {
        message = gettextCatalog.getString('The message is verified successfully')
      } else {
        message = gettextCatalog.getString('The message is NOT verified')
      }
      return message
    }

    function signMessage (message, passphrase) {
      var deferred = $q.defer()
      var crypto = require('crypto')
      var hash = crypto.createHash('sha256')
      hash = hash.update(Buffer.from(message, 'utf-8')).digest()
      var ecpair = ark.crypto.getKeys(passphrase)
      deferred.resolve({ signature: ecpair.sign(hash).toDER().toString('hex') })
      return deferred.promise
    }

    function signMessageWithLedger (message, path) {
      var deferred = $q.defer()
      ledgerService.signMessage(path, message).then(
        function (result) {
          deferred.resolve(result)
        },
        function (error) {
          deferred.reject(error)
        }
      )
      return deferred.promise
    }

    function createTransaction (type, config) {
      var deferred = $q.defer()
      getFees().then(function (fees) {
        var account
        var transaction
        if (type === 0) { // send ark
          if (!ark.crypto.validateAddress(config.toAddress, networkService.getNetwork().version)) {
            deferred.reject(gettextCatalog.getString('The destination address ') + config.toAddress + gettextCatalog.getString(' is erroneous'))
            return deferred.promise
          }

          account = getAccount(config.fromAddress)
          if (config.amount + fees.send > account.balance) {
            deferred.reject(gettextCatalog.getString('Not enough ARK on your account ') + config.fromAddress)
            return deferred.promise
          }

          try {
            transaction = ark.transaction.createTransaction(config.toAddress, config.amount, config.smartbridge, config.masterpassphrase, config.secondpassphrase)
          } catch (e) {
            deferred.reject(e)
            return deferred.promise
          }

          transaction.senderId = config.fromAddress

          if (config.ledger) {
            delete transaction.signature
            transaction.senderPublicKey = config.publicKey
            ledgerService.signTransaction(config.ledger, transaction).then(
              function (result) {
                console.log(result)
                transaction.signature = result.signature
                transaction.id = ark.crypto.getId(transaction)
                deferred.resolve(transaction)
              },
              function (error) {
                deferred.reject(error)
              }
            )
            return deferred.promise
          } else if (ark.crypto.getAddress(transaction.senderPublicKey, networkService.getNetwork().version) != config.fromAddress) {
            deferred.reject(gettextCatalog.getString('Passphrase is not corresponding to account ') + config.fromAddress)
          } else {
            deferred.resolve(transaction)
          }
        } else if (type === 1) { // second passphrase creation
          account = getAccount(config.fromAddress)
          if (account.balance < fees.secondpassphrase) {
            deferred.reject(gettextCatalog.getString('Not enough ARK on your account ') + config.fromAddress + ', ' + gettextCatalog.getString('you need at least 5 ARK to create a second passphrase'))
            return deferred.promise
          }
          try {
            transaction = ark.signature.createSignature(config.masterpassphrase, config.secondpassphrase)
          } catch (e) {
            deferred.reject(e)
            return deferred.promise
          }

          transaction.senderId = config.fromAddress

          if (config.ledger) {
            delete transaction.signature
            transaction.senderPublicKey = config.publicKey
            ledgerService.signTransaction(config.ledger, transaction).then(
              function (result) {
                console.log(result)
                transaction.signature = result.signature
                transaction.id = ark.crypto.getId(transaction)
                deferred.resolve(transaction)
              },
              function (error) {
                deferred.reject(error)
              }
            )
            return deferred.promise
          } else if (ark.crypto.getAddress(transaction.senderPublicKey, networkService.getNetwork().version) != config.fromAddress) {
            deferred.reject(gettextCatalog.getString('Passphrase is not corresponding to account ') + config.fromAddress)
            return deferred.promise
          }
          deferred.resolve(transaction)
        } else if (type === 2) { // delegate creation
          account = getAccount(config.fromAddress)
          if (account.balance < fees.delegate) {
            deferred.reject(gettextCatalog.getString('Not enough ARK on your account ') + config.fromAddress + ', ' + gettextCatalog.getString('you need at least 25 ARK to register delegate'))
            return deferred.promise
          }
          console.log(config)
          try {
            transaction = ark.delegate.createDelegate(config.masterpassphrase, config.username, config.secondpassphrase)
          } catch (e) {
            deferred.reject(e)
            return deferred.promise
          }

          transaction.senderId = config.fromAddress

          if (config.ledger) {
            delete transaction.signature
            transaction.senderPublicKey = config.publicKey
            ledgerService.signTransaction(config.ledger, transaction).then(
              function (result) {
                console.log(result)
                transaction.signature = result.signature
                transaction.id = ark.crypto.getId(transaction)
                deferred.resolve(transaction)
              },
              function (error) {
                deferred.reject(error)
              }
            )
            return deferred.promise
          } else if (ark.crypto.getAddress(transaction.senderPublicKey, networkService.getNetwork().version) != config.fromAddress) {
            deferred.reject(gettextCatalog.getString('Passphrase is not corresponding to account ') + config.fromAddress)
            return deferred.promise
          }
          deferred.resolve(transaction)
        } else if (type === 3) { // vote
          account = getAccount(config.fromAddress)
          if (account.balance < fees.vote) {
            deferred.reject(gettextCatalog.getString('Not enough ARK on your account ') + config.fromAddress + ', ' + gettextCatalog.getString('you need at least 1 ARK to vote'))
            return deferred.promise
          }
          try {
            transaction = ark.vote.createVote(config.masterpassphrase, config.publicKeys.split(','), config.secondpassphrase)
          } catch (e) {
            deferred.reject(e)
            return deferred.promise
          }

          transaction.senderId = config.fromAddress

          if (config.ledger) {
            delete transaction.signature
            transaction.recipientId = config.fromAddress
            transaction.senderPublicKey = config.publicKey
            ledgerService.signTransaction(config.ledger, transaction).then(
              function (result) {
                console.log(result)
                transaction.signature = result.signature
                transaction.id = ark.crypto.getId(transaction)
                deferred.resolve(transaction)
              },
              function (error) {
                deferred.reject(error)
              }
            )
            return deferred.promise
          } else if (ark.crypto.getAddress(transaction.senderPublicKey, networkService.getNetwork().version) !== config.fromAddress) {
            deferred.reject(gettextCatalog.getString('Passphrase is not corresponding to account ') + config.fromAddress)
            return deferred.promise
          }
          deferred.resolve(transaction)
        }
      })

      return deferred.promise
    }

    // Given a final list of delegates, create a vote assets list to be sent
    // return null if could not make it
    function createDiffVote (address, newdelegates) {
      function arrayObjectIndexOf (myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
          if (myArray[i][property] === searchTerm) return i
        }
        return -1
      }

      var assets = []
      var votedDelegates = storageService.get('voted-' + address) || []
      votedDelegates = votedDelegates.map(function (delegate) {
        return {
          username: delegate.username,
          address: delegate.address,
          publicKey: delegate.publicKey
        }
      })

      var delegates = newdelegates.map(function (delegate) {
        return {
          username: delegate.username,
          address: delegate.address,
          publicKey: delegate.publicKey
        }
      })

      if (delegates.length > 101) {
        return null
      }
      var difflist = []
      var notRemovedDelegates = []
      for (var i in delegates) {
        var delegate = delegates[i]
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
      for (var j in votedDelegates) {
        var votedDelegate = votedDelegates[j]
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
      var deferred = $q.defer()
      var result = []
      $http.get('https://gist.githubusercontent.com/fix/a7b1d797be38b0591e725a24e6735996/raw/sponsors.json').then(function (resp) {
        var count = 0
        for (var i in resp.data) {
          networkService.getFromPeer('/api/delegates/get/?publicKey=' + resp.data[i].publicKey).then(function (resp2) {
            if (resp2.data && resp2.data.success && resp2.data.delegate) {
              result.push(resp2.data.delegate)
            }
            count++
            if (count === resp.data.length - 1) {
              deferred.resolve(result)
            }
          }, () => count++)
        }
      }, function (err) {
        console.log(err)
        deferred.reject(gettextCatalog.getString('Cannot get sponsors'))
      })
      return deferred.promise
    }

    function createVirtual (passphrase) {
      var deferred = $q.defer()
      var address = ark.crypto.getAddress(ark.crypto.getKeys(passphrase).publicKey, networkService.getNetwork().version)
      var account = getAccount(address)
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
      var virtual = getVirtual(address)
      var f = virtual[folder]
      if (f && amount >= 0) {
        f.amount = amount
      } else if (!f && amount >= 0) {
        virtual[folder] = { amount: amount }
      }
      storageService.set('virtual-' + address, virtual)
      return getVirtual(address)
    }

    function deleteFolder (address, folder) {
      var virtual = storageService.get('virtual-' + address)
      delete virtual[folder]
      storageService.set('virtual-' + address, virtual)
      return getVirtual(address)
    }

    function renameFolder (address, folder, newFolder) {
      var virtual = storageService.get('virtual-' + address)
      virtual[newFolder] = virtual[folder]
      delete virtual[folder]
      storageService.set('virtual-' + address, virtual)
      return getVirtual(address)
    }

    function getVirtual (address) {
      var virtual = storageService.get('virtual-' + address)
      if (virtual) {
        virtual.uservalue = function (folder) {
          return function (value) {
            if (virtual[folder]) {
              if (arguments.length === 1) {
                if (value === null) {
                  virtual[folder].amount = null
                } else {
                  virtual[folder].amount = value * ARKTOSHI_UNIT
                }
              } else {
                return virtual[folder].amount === null ? '' : virtual[folder].amount / ARKTOSHI_UNIT
              }
            }
          }
        }
        virtual.getFolders = function () {
          var folders = []
          for (var i in virtual) {
            if (virtual.hasOwnProperty(i) && typeof virtual[i] !== 'function') {
              folders.push(i)
            }
          }
          return folders
        }
      }
      return virtual
    }

    var allowedDelegateNameChars = /^[a-z0-9!@$&_.]+$/g

    function sanitizeDelegateName (delegateName) {
      if (!delegateName) {
        throw new Error('Delegate name is undefined')
      }
      if (delegateName !== delegateName.toLowerCase()) {
        throw new Error('Delegate name must be lowercase')
      }

      var sanitizedName = String(delegateName).toLowerCase().trim()
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

    function numberToFixed (x) {
      var e
      if (Math.abs(x) < 1.0) {
        e = parseInt(x.toString().split('e-')[1])
        if (e) {
          x *= Math.pow(10, e - 1)
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2)
        }
      } else {
        e = parseInt(x.toString().split('+')[1])
        if (e > 20) {
          e -= 20
          x /= Math.pow(10, e)
          x += (new Array(e + 1)).join('0')
        }
      }
      return x
    }

    function smallId (fullId) {
      return fullId.slice(0, 5) + '...' + fullId.slice(-5)
    }

    return {
      loadAllAccounts: function () {
        var accounts = storageService.get('addresses')

        if (!accounts) {
          return []
        }

        accounts = accounts.filter(function (a) {
          return !a.ledger
        })

        var uniqueaccounts = []
        for (var i in accounts) {
          if (uniqueaccounts.indexOf(accounts[i]) === -1) {
            uniqueaccounts.push(accounts[i])
          }
        }
        accounts = uniqueaccounts
        accounts = accounts.filter(function (address) {
          return (storageService.get('username-' + address) != null || storageService.get('virtual-' + address) != null) && !storageService.get(address).ledger
        })
        return accounts.map(function (address) {
          var account = storageService.get(address)
          if (account) {
            account.transactions = storageService.get('transactions-' + address)
            account.delegate = storageService.get('delegate-' + address)
            account.username = storageService.get('username-' + address)
            account.virtual = getVirtual(address)
            return account
          }
          return { address: address }
        })
      },

      getAccount: getAccount,

      refreshAccount: function (account) {
        return fetchAccount(account.address)
      },

      setUsername: function (address, username) {
        storageService.set('username-' + address, username)
      },

      getUsername: function (address) {
        return storageService.get('username-' + address) || address
      },

      addWatchOnlyAddress: addWatchOnlyAddress,

      createAccount: createAccount,

      savePassphrases: savePassphrases,

      getPassphrases: getPassphrases,

      removeAccount: removeAccount,

      fetchAccount: fetchAccount,

      fetchAccountAndForget: fetchAccountAndForget,

      getTransactions: getTransactions,

      createTransaction: createTransaction,

      verifyMessage: verifyMessage,

      signMessage: signMessage,

      signMessageWithLedger: signMessageWithLedger,

      createDiffVote: createDiffVote,

      getVotedDelegates: getVotedDelegates,

      getDelegate: getDelegate,

      getActiveDelegates: getActiveDelegates,

      getDelegateByUsername: getDelegateByUsername,

      getSponsors: getSponsors,

      getTransactionLabel: getTransactionLabel,

      createVirtual: createVirtual,

      setToFolder: setToFolder,

      deleteFolder: deleteFolder,

      renameFolder: renameFolder,

      sanitizeDelegateName: sanitizeDelegateName,

      numberToFixed: numberToFixed,

      smallId: smallId,

      formatTransaction: formatTransaction

    }
  }
})()
