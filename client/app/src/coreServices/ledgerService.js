(function() {
  'use strict';

  let ipcRenderer = require('electron').ipcRenderer;
  let arkjs = require('arkjs');
  let bip39 = require('bip39');

  angular.module('arkclient.coreServices')
         .service('ledgerService', ['$q', '$http', '$timeout', 'storageService', LedgerService]);

  /**
   * NetworkService
   * @constructor
   */
  function LedgerService($q, $http, $timeout, storageService) {

    function deriveAddress(path){
      return ipcRenderer.sendSync('ledger', {
        action: "getAddress",
        path: path
      });
    }

    function getBip44Accounts(){
      let accounts = [];
      let account_index = 0;
      let address_index = 0;
      let path = "44'/111'/";
      let empty = false;

      while(!empty){
        let localpath = path + account_index + "'/0/" + address_index;
        let result = ipcRenderer.sendSync('ledger', {
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
          } else {
            result.ledger = localpath;
            result.cold = true;
            result.virtual = storageService.get("virtual-" + result.address);
            if (!result.virtual) {
              result.virtual = [];
              storageService.set("virtual-" + result.address, result.virtual);
            }
            storageService.set(result.address, result);
            accounts.push(result);
            empty = true;
          }
        } else {
          empty = true;
        }
      }
      return accounts;
    }

    function recoverBip44Accounts(backupLedgerPassphrase) {
      var hdnode = new arkjs.HDNode.fromSeedHex(bip39.mnemonicToSeedHex(backupLedgerPassphrase));

      let accounts = [];
      let account_index = 0;
      let address_index = 0;
      let path = "44'/111'/";
      let empty = false;

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

    function detect(){
      return ipcRenderer.sendSync('ledger', {
        action: "detect"
      });
    }

    function isAppLaunched(){
      return ipcRenderer.sendSync('ledger', {
        action: "getConfiguration"
      });
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
