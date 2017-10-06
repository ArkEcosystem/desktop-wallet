(function() {
  'use strict';

  var ipcRenderer = require('electron').ipcRenderer;
  var arkjs = require('arkjs');
  var bip39 = require('bip39');
  var async = require('async');

  angular.module('arkclient.services')
    .service('ledgerService', ['$q', '$http', '$timeout', 'storageService', 'networkService', LedgerService]);

  /**
   * NetworkService
   * @constructor
   */
  function LedgerService($q, $http, $timeout, storageService, networkService) {

    function deriveAddress(path) {
      var result = ipcRenderer.sendSync('ledger', {
        action: "getAddress",
        path: path
      });
      return result
    }

    function getBip44Accounts(slip44) {
      var deferred = $q.defer();
      var accounts = [];
      var account_index = 0;
      var address_index = 0;
      var path = "44'/" + (slip44 || "111") + "'/";
      var empty = false;

      async.whilst(
        function () {
          return !empty;
        },
        function (next) {
          var localpath = path + account_index + "'/0/" + address_index;
          var result = ipcRenderer.sendSync('ledger', {
            action: "getAddress",
            path: localpath
          });
          if (result.address) {
            result.address = arkjs.crypto.getAddress(result.publicKey);
            account_index = account_index + 1;
  
            var account = storageService.get(result.address);
            if (account && !account.cold) {
              account.virtual = storageService.get("virtual-" + result.address);
              if (!account.virtual) {
                account.virtual = [];
                storageService.set("virtual-" + result.address, account.virtual);
              }
              account.ledger = localpath;
              account.publicKey = result.publicKey;
              storageService.set(result.address, account);
              accounts.push(account);
              next();
            } else {
              result.ledger = localpath;
              result.virtual = storageService.get("virtual-" + result.address);
              result.cold = true;
              if (!result.virtual) {
                result.virtual = [];
                storageService.set("virtual-" + result.address, result.virtual);
              }
              storageService.set(result.address, result);
              accounts.push(result);
              networkService.getFromPeer("/api/transactions?orderBy=timestamp:desc&limit=1&recipientId=" + result.address + "&senderId=" + result.address).then(function(resp) {
                if (resp.success) {
                  empty = resp.count == 0;
                  next();
                } else {
                  empty = true;
                  next();
                }
              },
              function(err){
                empty = true;
                next();
              }
            );
              
            }
          } else {
            empty = true;
            next();
          }
        },
        function (err) {
          if(err){
            deferred.reject(err);
          }
          else{
            deferred.resolve(accounts);
          }
        }
      );

      return deferred.promise;
    }

    function recoverBip44Accounts(backupLedgerPassphrase, slip44) {
      var hdnode = new arkjs.HDNode.fromSeedHex(bip39.mnemonicToSeedHex(backupLedgerPassphrase));

      var accounts = [];
      var account_index = 0;
      var address_index = 0;
      var path = "44'/" + (slip44 || "111") + "'/";
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
      ipcRenderer.once('transactionSigned', function(event, result) {
        if (result.error) {
          deferred.reject(result.error)
        } else {
          deferred.resolve(result);
        }
      });
      ipcRenderer.send('ledger', {
        action: "signTransaction",
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
      ipcRenderer.once('messageSigned', function(event, result) {
        if (result.error) {
          deferred.reject(result.error)
        } else {
          deferred.resolve(result);
        }
      });
      ipcRenderer.send('ledger', {
        action: "signMessage",
        data: hash.toString("hex"),
        path: path
      });
      return deferred.promise;
    }

    function detect() {
      var result = ipcRenderer.sendSync('ledger', {
        action: "detect"
      });
      return result
    }

    function isAppLaunched() {
      var result = ipcRenderer.sendSync('ledger', {
        action: "getConfiguration"
      });
      return result;
    }

    return {
      deriveAddress: deriveAddress,
      signTransaction: signTransaction,
      signMessage: signMessage,
      detect: detect,
      isAppLaunched: isAppLaunched,
      getBip44Accounts: getBip44Accounts,
      recoverBip44Accounts: recoverBip44Accounts
    };
  }

})();
