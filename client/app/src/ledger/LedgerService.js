(function(){
  'use strict';

  var ipcRenderer = require('electron').ipcRenderer;
  var arkjs = require('arkjs');

  angular.module('arkclient')
         .service('ledgerService', ['$q', '$http', '$timeout', 'storageService', LedgerService]);

  /**
   * NetworkService
   * @constructor
   */
  function LedgerService($q,$http,$timeout,storageService){

    function deriveAddress(path){
      // var result = ipcRenderer.sendSync('ledger', {
      //   action: "getConfiguration"
      // });
      // console.log(result);

      // result = ipcRenderer.sendSync('ledger', {
      //   action: "signMessage",
      //   data: "this is a test",
      //   path: "44'/60'/0'/0'/0"
      // });
      // console.log(result);
      //
      // result = ipcRenderer.sendSync('ledger', {
      //   action: "getConfiguration"
      // });
      // console.log(result);
      //
      // result = ipcRenderer.sendSync('ledger', {
      //   action: "signTransaction",
      //   data: "e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080",
      //   path: "44'/60'/0'/0'/0"
      // });
      // console.log(result);

      var result = ipcRenderer.sendSync('ledger', {
        action: "getAddress",
        path: path
      });
      return result
    }

    function getBip44Accounts(){
      var accounts = [];
      var account_index = 0;
      var address_index = 0;
      var path = "44'/111'/";
      var empty = false;

      while(!empty){
        var localpath = path + account_index + "'/0/" + address_index;
        var result = ipcRenderer.sendSync('ledger', {
          action: "getAddress",
          path: localpath
        });
        if(result.address){
          account_index = account_index + 1;
          var account = storageService.get(result.address);
          if(account && !account.cold){
            account.ledger = localpath;
            storageService.set(result.address, account);
            accounts.push(account);
          }
          else{
            result.ledger = localpath;
            result.cold = true;
            storageService.set(result.address, result);
            accounts.push(result);
            empty = true;
          }
        }
        else {
          empty = true;
        }
      }
      return accounts;
    }

    function signTransaction(path, transaction){
      var deferred = $q.defer();
      ipcRenderer.once('transactionSigned', function(event, result){
        if(result.error){
          deferred.reject(result.error)
        }
        else{
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

    function detect(){
      var result = ipcRenderer.sendSync('ledger', {
        action: "detect"
      });
      return result
    }

    function isAppLaunched(){
      var result = ipcRenderer.sendSync('ledger', {
        action: "getConfiguration"
      });
      return result;
    }

    return {
      deriveAddress: deriveAddress,
      signTransaction: signTransaction,
      detect: detect,
      isAppLaunched: isAppLaunched,
      getBip44Accounts: getBip44Accounts
    };
  }

})();
