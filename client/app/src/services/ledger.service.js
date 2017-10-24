(function () {
  'use strict';

  var ipcRenderer = require('electron').ipcRenderer;
  var arkjs = require('arkjs');
  var bip39 = require('bip39');

  angular.module('arkclient.services')
    .service('ledgerService', ['$q', '$http', '$timeout', 'storageService', 'networkService', LedgerService]);

  /**
   * NetworkService
   * @constructor
   */
  function LedgerService($q, $http, $timeout, storageService, networkService) {

    var ledgerConnected = false
    
    ipcRenderer.on("MAIN_RENDER_LEDGER", (event, args) => {
      ledgerConnected = args.ledgerConnected
    })
    
    function deriveAddress(path) {
      var result = ipcRenderer.sendSync('ledger', {
        action: "getAddress",
        path: path
      });
      return result
    }
    
    function getBip44Account(path, accounts, deferred, account_index, address_index) {
      var localpath = path + account_index + "'/0/" + address_index;
      ipcRenderer.send('ledger', {action: "GET_ADDRESSES", path: localpath})
      ipcRenderer.once("GET_ADDRESSES", (event, args) => {
          if (args.value) {
            var result = args.value
            if (result.address) {
              result.address = arkjs.crypto.getAddress(result.publicKey);
              account_index = account_index + 1;
              var account = storageService.get(result.address) || result;
              account.ledger = localpath;
              var txs = storageService.get("transactions-" + account.address);
              account.cold = !txs || txs.length == 0;
              account.publicKey = result.publicKey;
              storageService.set(account.address, account);
              account.virtual = storageService.get("virtual-" + account.address) || [];
              storageService.set("virtual-" + account.address, account.virtual)
              accounts.push(account);
              if (account.cold) {
                networkService.getFromPeer("/api/transactions?orderBy=timestamp:desc&limit=1&recipientId=" + account.address + "&senderId=" + account.address).then(
                  function (resp) {
                    if (resp.success && resp.count != 0) {
                      getBip44Account(path, accounts, deferred, account_index + 1, address_index)
                    } else {
                      deferred.resolve(accounts)
                    }
                  },
                  function (err) {
                    deferred.resolve(accounts)
                  }
                );
              } else {
                getBip44Account(path, accounts, deferred, account_index+1, address_index)
              }
            } else {
              deferred.resolve(accounts)
            }
          } else {
            console.error("Error getting ledger accounts: " + args.error)
            deferred.reject(args.error)
          }
        }
      );

      return deferred.promise;
    }

    function getBip44Accounts(slip44) {
      var deferred = $q.defer()
      var accounts = [];
      var account_index = 0;
      var address_index = 0;

      getBip44Account("44'/" + (slip44 || "111") + "'/", accounts, deferred, account_index, address_index)

      return deferred.promise
    }

    function recoverBip44Accounts(backupLedgerPassphrase) {
      var hdnode = new arkjs.HDNode.fromSeedHex(bip39.mnemonicToSeedHex(backupLedgerPassphrase));

      var accounts = [];
      var account_index = 0;
      var address_index = 0;
      var path = "44'/111'/";
      var empty = false;

      while (!empty) {
        var localpath = path + account_index + "'/0/" + address_index;
        var keys = hdnode.derivePath(localpath).keyPair;
        var address = keys.getAddress();
        account_index = account_index + 1;
        var account = storageService.get(address);
        if (account && !account.cold) {
          account.ledger = localpath;
          storageService.set(address, account);
          accounts.push(account);
        } else {
          var result = {
            address: address,
            publicKey: keys.getPublicKeyBuffer().toString("hex"),
            ledger: localpath,
            cold: true
          };
          storageService.set(address, result);
          accounts.push(result);
          empty = true;
        }
      }
      return accounts;
    }

    function signTransaction(path, transaction) {
      var deferred = $q.defer();
      // Because I'm new to these technologies didn't find an easy way to have the CONSTANTS module defined in the root 
      // of project being caught, I always got module not found. Someone wants to give hand? :P 
      ipcRenderer.once('SIGN_TRANSACTION', function (event, result) {
        if (result.error) {
          deferred.reject(result.error)
        } else {
          deferred.resolve(result);
        }
      });
      ipcRenderer.send('ledger', {
        action: "SIGN_TRANSACTION",
        data: arkjs.crypto.getBytes(transaction, true, true).toString("hex"),
        path: path
      });
      return deferred.promise;
    }

    function signMessage(path, message) {
      var deferred = $q.defer();
      var crypto = require("crypto");
      var hash = crypto.createHash('sha256');
      hash = hash.update(new Buffer(message, "utf-8")).digest();
      ipcRenderer.once('SIGN_MESSAGE', function (event, result) {
        if (result.error) {
          deferred.reject(result.error)
        } else {
          deferred.resolve(result);
        }
      });
      ipcRenderer.send('ledger', {
        action: "SIGN_MESSAGE",
        data: hash.toString("hex"),
        path: path
      });
      return deferred.promise;
    }

    function isLedgerConnected() {
      return ledgerConnected
    }

    return {
      deriveAddress: deriveAddress,
      signTransaction: signTransaction,
      signMessage: signMessage,
      isLedgerConnected: isLedgerConnected,
      getBip44Accounts: getBip44Accounts,
      recoverBip44Accounts: recoverBip44Accounts
    };
  }

})();
