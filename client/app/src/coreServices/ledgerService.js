const ipcRenderer = require('electron').ipcRenderer;
const arkjs = require('arkjs');
const bip39 = require('bip39');
const crypto = require('crypto');


/**
 * NetworkService
 * @constructor
 */
function LedgerService($q, $http, $timeout, storageService) {
  function deriveAddress(path) {
    return ipcRenderer.sendSync('ledger', {
      action: 'getAddress',
      path,
    });
  }

  function getBip44Accounts() {
    const accounts = [];
    let accountIndex = 0;
    const addressIndex = 0;
    const path = "44'/111'/";
    let empty = false;

    while (!empty) {
      const localpath = `${path + accountIndex}'/0/${addressIndex}`;
      const result = ipcRenderer.sendSync('ledger', {
        action: 'getAddress',
        path: localpath,
      });
      if (result.address) {
        result.address = arkjs.crypto.getAddress(result.publicKey);
        accountIndex += 1;

        const account = storageService.get(result.address);
        if (account && !account.cold) {
          account.virtual = storageService.get(`virtual-${result.address}`);
          if (!account.virtual) {
            account.virtual = [];
            storageService.set(`virtual-${result.address}`, account.virtual);
          }
          account.ledger = localpath;
          storageService.set(result.address, account);
          accounts.push(account);
        } else {
          result.ledger = localpath;
          result.cold = true;
          result.virtual = storageService.get(`virtual-${result.address}`);
          if (!result.virtual) {
            result.virtual = [];
            storageService.set(`virtual-${result.address}`, result.virtual);
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
    const hdnode = new arkjs.HDNode.fromSeedHex(bip39.mnemonicToSeedHex(backupLedgerPassphrase));

    const accounts = [];
    let accountIndex = 0;
    const addressIndex = 0;
    const path = "44'/111'/";
    let empty = false;

    while (!empty) {
      const localpath = `${path + accountIndex}'/0/${addressIndex}`;
      const keys = hdnode.derivePath(localpath).keyPair;
      const address = keys.getAddress();
      accountIndex += 1;
      const account = storageService.get(address);
      if (account && !account.cold) {
        account.ledger = localpath;
        storageService.set(address, account);
        accounts.push(account);
      } else {
        const result = {
          address,
          publicKey: keys.getPublicKeyBuffer().toString('hex'),
          ledger: localpath,
          cold: true,
        };
        storageService.set(address, result);
        accounts.push(result);
        empty = true;
      }
    }
    return accounts;
  }

  function signTransaction(path, transaction) {
    const deferred = $q.defer();
    ipcRenderer.once('transactionSigned', (event, result) => {
      if (result.error) {
        deferred.reject(result.error);
      } else {
        deferred.resolve(result);
      }
    });
    ipcRenderer.send('ledger', {
      action: 'signTransaction',
      data: arkjs.crypto.getBytes(transaction, true, true).toString('hex'),
      path,
    });
    return deferred.promise;
  }

  function signMessage(path, message) {
    const deferred = $q.defer();
    let hash = crypto.createHash('sha256');
    hash = hash.update(new Buffer(message, 'utf-8')).digest();
    ipcRenderer.once('messageSigned', (event, result) => {
      if (result.error) {
        deferred.reject(result.error);
      } else {
        deferred.resolve(result);
      }
    });
    ipcRenderer.send('ledger', {
      action: 'signMessage',
      data: hash.toString('hex'),
      path,
    });
    return deferred.promise;
  }

  function detect() {
    return ipcRenderer.sendSync('ledger', {
      action: 'detect',
    });
  }

  function isAppLaunched() {
    return ipcRenderer.sendSync('ledger', {
      action: 'getConfiguration',
    });
  }

  return {
    deriveAddress,
    signTransaction,
    signMessage,
    detect,
    isAppLaunched,
    getBip44Accounts,
    recoverBip44Accounts,
  };
}

angular.module('arkclient.coreServices')
  .service('ledgerService', ['$q', '$http', '$timeout', 'storageService', LedgerService]);
