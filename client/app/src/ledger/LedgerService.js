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

    function signTransaction(path, transaction){
      var result = ipcRenderer.sendSync('ledger', {
        action: "signTransaction",
        data: arkjs.crypto.getBytes(transaction).toString("hex"),
        path: path
      });
      return result

    }


    return {
      deriveAddress: deriveAddress,
      signTransaction: signTransaction
    };
  }

})();
