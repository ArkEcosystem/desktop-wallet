/**
 * Main Controller for the arkclient.Accounts module
 * @constructor
 */
function AccountController(accountService, networkService, storageService, changerService,
  ledgerService, $mdToast, $mdSidenav, $mdBottomSheet, $timeout, $interval, $log,
  $mdDialog, $scope, $mdMedia, gettextCatalog) {
  const self = this;

  const languages = {
    en: gettextCatalog.getString('English'),
    zh_CN: gettextCatalog.getString('Chinese simplified'),
    zh_TW: gettextCatalog.getString('Chinese traditional'),
    fr: gettextCatalog.getString('French'),
    el: gettextCatalog.getString('Greek'),
    nl: gettextCatalog.getString('Dutch'),
    ar: gettextCatalog.getString('Arab'),
    pl: gettextCatalog.getString('Polish'),
    pt_BR: gettextCatalog.getString('Portuguese'),
    bg_BG: gettextCatalog.getString('Bulgarian'),
    hu: gettextCatalog.getString('Hungarish'),
    sl: gettextCatalog.getString('Slovenian'),
    ro: gettextCatalog.getString('Romanian'),
    de: gettextCatalog.getString('German'),
    it: gettextCatalog.getString('Italian'),
    id: gettextCatalog.getString('Indonesian'),
    ru: gettextCatalog.getString('Russian'),
  };


  gettextCatalog.debug = false;
  self.language = storageService.get('language');
  if (!self.language) selectNextLanguage();
  else gettextCatalog.setCurrentLanguage(self.language);

  self.getLanguage = function () {
    return languages[self.language];
  };


  self.closeApp = function () {
    const confirm = $mdDialog.confirm()
      .title(gettextCatalog.getString('Quit Ark Client?'))
      .ok(gettextCatalog.getString('Quit'))
      .cancel(gettextCatalog.getString('Cancel'));
    $mdDialog.show(confirm).then(() => {
      require('electron').remote.app.quit();
    });
  };

  self.windowApp = function (action, args) {
    const curWin = require('electron').remote.getCurrentWindow();
    if (curWin[action]) { return curWin[action](args); }
    return null;
  };

  self.clearData = function () {
    const confirm = $mdDialog.confirm()
      .title(gettextCatalog.getString('Are you sure?'))
      .textContent(gettextCatalog.getString('All your data, including created accounts, networks and contacts will be removed from the app and reset to default.'))
      .ariaLabel(gettextCatalog.getString('Confirm'))
      .ok(gettextCatalog.getString('Yes'))
      .cancel(gettextCatalog.getString('Cancel'));

    $mdDialog.show(confirm).then(() => {
      storageService.clearData();
      self.windowApp('reload');
    });
  };

  self.openExternal = function (url) {
    require('electron').shell.openExternal(url);
  };

  self.openExplorer = openExplorer;
  self.clientVersion = require('../../../package.json').version;
  self.latestClientVersion = self.clientVersion;
  networkService.getLatestClientVersion().then((r) => { self.latestClientVersion = r; });
  self.isNetworkConnected = false;
  self.selected = null;
  self.accounts = [];
  self.selectAccount = selectAccount;
  self.refreshCurrentAccount = refreshCurrentAccount;
  self.gotoAddress = gotoAddress;
  self.getAllDelegates = getAllDelegates;
  self.addWatchOnlyAddress = addWatchOnlyAddress;
  self.createAccount = createAccount;
  self.importAccount = importAccount;
  self.toggleList = toggleAccountsList;
  self.sendArk = sendArk;
  self.createSecondPassphrase = createSecondPassphrase;
  self.copiedToClipboard = copiedToClipboard;

  self.playFundsReceivedSong = storageService.get('playFundsReceivedSong') || false;
  self.togglePlayFundsReceivedSong = togglePlayFundsReceivedSong;
  self.manageBackgrounds = manageBackgrounds;
  self.manageNetworks = manageNetworks;
  self.openPassphrasesDialog = openPassphrasesDialog;
  self.createDelegate = createDelegate;
  self.vote = vote;
  self.addDelegate = addDelegate;
  self.showAccountMenu = showAccountMenu;
  self.selectNextLanguage = selectNextLanguage;
  self.currency = storageService.get('currency') || { name: 'btc', symbol: 'Ƀ' };
  self.switchNetwork = networkService.switchNetwork;
  self.marketinfo = {};
  self.network = networkService.getNetwork();
  self.listNetworks = networkService.getNetworks();
  self.context = storageService.getContext();
  self.exchangeHistory = changerService.getHistory();
  self.selectedCoin = storageService.get('selectedCoin') || 'bitcoin_BTC';
  self.exchangeEmail = storageService.get('email') || '';

  self.connectedPeer = { isConnected: false };

  // refreshing displayed account every 8s
  $interval(() => {
    if (self.selected) {
      self.refreshCurrentAccount();
    }
  }, 8 * 1000);

  // detect Ledger
  $interval(() => {
    if (!self.ledgerAccounts && self.ledger && self.ledger.connected) {
      self.ledgerAccounts = ledgerService.getBip44Accounts();
    }
    if (ledgerService.detect().status === 'Success') {
      self.ledger = ledgerService.isAppLaunched();
      if (!self.ledger.connected) {
        self.ledgerAccounts = null;
      }
    } else {
      self.ledgerAccounts = null;
      self.ledger = { connected: false };
    }
  }, 2 * 1000);

  self.selectLedgerAccount = function (account) {
    if (!account && self.ledgerAccounts) {
      account = self.ledgerAccounts[0];
    }
    if (account) {
      self.gotoAddress(account.address);
    }
  };

  self.connection = networkService.getConnection();

  self.connection.then(
    () => {},
    () => {},
    (connectedPeer) => {
      self.connectedPeer = connectedPeer;
      if (!self.connectedPeer.isConnected && self.isNetworkConnected) {
        self.isNetworkConnected = false;
        $mdToast.show(
          $mdToast.simple()
            .textContent(gettextCatalog.getString('Network disconnected!'))
            .hideDelay(10000),
        );
      } else if (self.connectedPeer.isConnected && !self.isNetworkConnected) {
        self.isNetworkConnected = true;
        // trick to make it appear last.
        $timeout(() => {
          $mdToast.show(
            $mdToast.simple()
              .textContent(gettextCatalog.getString('Network connected and healthy!'))
              .hideDelay(10000),
          );
        }, 1000);
      }
    },
  );

  function openExplorer(uri) {
    require('electron').shell.openExternal(self.network.explorer + uri);
  }

  function formatErrorMessage(error) {
    let basicMessage = '';
    if (typeof error === 'string') {
      basicMessage = error;
    } else if (typeof error.error === 'string') {
      basicMessage = error.error;
    } else if (typeof error.data === 'string') {
      basicMessage = error.data;
    } else if (typeof error.message === 'string') {
      basicMessage = error.message;
    }
    const errorMessage = gettextCatalog.getString('Error: ') + basicMessage.replace('Error: ', '');
    console.error(errorMessage, '\n', error);
    return errorMessage;
  }

  function formatAndToastError(error, hideDelay) {
    if (!hideDelay) {
      hideDelay = 5000;
    }
    const errorMessage = formatErrorMessage(error);
    $mdToast.show(
      $mdToast.simple()
        .textContent(errorMessage)
        .hideDelay(hideDelay)
        .theme('error'),
    );
  }

  function copiedToClipboard() {
    $mdToast.show(
      $mdToast.simple()
        .textContent(gettextCatalog.getString('Copied to clipboard'))
        .hideDelay(5000),
    );
  }
  self.selectAllLanguages = function () {
    return languages;
  };

  $scope.setLanguage = function () {
    function getlanguage(value) {
      for (const prop in languages) {
        if (languages.hasOwnProperty(prop)) {
          if (languages[prop] === value) { return prop; }
        }
      }
    }
    self.language = getlanguage(this.selectedLanguage);
    storageService.set('language', self.language);
    gettextCatalog.setCurrentLanguage(self.language);
  };

  // TODO: deprecated
  function selectNextLanguage() {
    const lkeys = Object.keys(languages);
    if (self.language) self.language = lkeys[(lkeys.indexOf(self.language) + 1) % lkeys.length];
    else self.language = 'en';
    storageService.set('language', self.language);
    gettextCatalog.setCurrentLanguage(self.language);
  }

  self.getMarketInfo = function (symbol) {
    changerService.getMarketInfo(symbol, 'ark_ARK').then((answer) => {
      self.buycoin = answer;
    });

    changerService.getMarketInfo('ark_ARK', symbol).then((answer) => {
      self.sellcoin = answer;
    });
  };

  self.getMarketInfo(self.selectedCoin);

  self.buy = function () {
    if (self.exchangeEmail) storageService.set('email', self.exchangeEmail);
    if (self.selectedCoin) storageService.set('selectedCoin', self.selectedCoin);
    changerService.getMarketInfo(self.selectedCoin, 'ark_ARK', self.buyAmount / self.buycoin.rate).then((rate) => {
      let amount = self.buyAmount / rate.rate;
      if (self.selectedCoin.split('_')[1] === 'USD') {
        amount = parseFloat(amount.toFixed(2));
      }
      changerService.makeExchange(self.exchangeEmail, amount, self.selectedCoin, 'ark_ARK', self.selected.address).then((resp) => {
        self.exchangeBuy = resp;
        self.exchangeBuy.expirationPeriod = self.exchangeBuy.expiration - new Date().getTime() / 1000;
        self.exchangeBuy.expirationProgress = 0;
        self.exchangeBuy.expirationDate = new Date(self.exchangeBuy.expiration * 1000);
        self.exchangeBuy.sendCurrency = self.selectedCoin.split('_')[1];
        self.exchangeBuy.receiveCurrency = 'ARK';
        const progressbar = $interval(() => {
          if (!self.exchangeBuy) {
            $interval.cancel(progressbar);
          } else {
            self.exchangeBuy.expirationProgress = (100 - 100 * (self.exchangeBuy.expiration - new Date().getTime() / 1000) / self.exchangeBuy.expirationPeriod).toFixed(0);
          }
        }, 200);
        changerService.monitorExchange(resp).then(
          (data) => {
            self.exchangeHistory = changerService.getHistory();
          },
          (data) => {

          },
          (data) => {
            if (data.payee && self.exchangeBuy.payee !== data.payee) {
              self.exchangeBuy = data;
              self.exchangeHistory = changer.getHistory();
            } else {
              self.exchangeBuy.monitor = data;
            }
          },
        );
      }, (error) => {
        formatAndToastError(error, 10000);
        self.exchangeBuy = null;
      });
    });
  };

  self.sendBatch = function () {
    changerService.sendBatch(self.exchangeBuy, self.exchangeTransactionId).then((data) => {
      self.exchangeBuy.batch_required = false;
      self.exchangeTransactionId = null;
    },
    (error) => {
      formatAndToastError(error, 10000);
    });
  };

  self.sell = function () {
    if (self.exchangeEmail) storageService.set('email', self.exchangeEmail);
    changerService.makeExchange(self.exchangeEmail, self.sellAmount, 'ark_ARK', self.selectedCoin, self.recipientAddress).then((resp) => {
      accountService.createTransaction(0,
        {
          fromAddress: self.selected.address,
          toAddress: resp.payee,
          amount: parseInt(resp.send_amount * 100000000),
          masterpassphrase: self.passphrase,
          secondpassphrase: self.secondpassphrase,
        },
      ).then((transaction) => {
        console.log(transaction);
        self.exchangeTransaction = transaction;
        self.exchangeSell = resp;
        self.exchangeSell.expirationPeriod = self.exchangeSell.expiration - new Date().getTime() / 1000;
        self.exchangeSell.expirationProgress = 0;
        self.exchangeSell.expirationDate = new Date(self.exchangeSell.expiration * 1000);
        self.exchangeSell.receiveCurrency = self.selectedCoin.split('_')[1];
        self.exchangeSell.sendCurrency = 'ARK';
        const progressbar = $interval(() => {
          if (!self.exchangeSell) {
            $interval.cancel(progressbar);
          } else {
            self.exchangeSell.expirationProgress = (100 - 100 * (self.exchangeSell.expiration - new Date().getTime() / 1000) / self.exchangeSell.expirationPeriod).toFixed(0);
          }
        }, 200);

        self.exchangeSellTransaction = transaction;
        changerService.monitorExchange(resp).then(
          (data) => {
            self.exchangeHistory = changerService.getHistory();
          },
          (data) => {

          },
          (data) => {
            if (data.payee && self.exchangeSell.payee !== data.payee) {
              self.exchangeSell = data;
              self.exchangeHistory = changer.getHistory();
            } else {
              self.exchangeSell.monitor = data;
            }
          },
        );
      },
      (error) => {
        formatAndToastError(error, 10000);
      });
      self.passphrase = null;
      self.secondpassphrase = null;
    }, (error) => {
      formatAndToastError(error, 10000);
      self.exchangeSell = null;
    });
  };

  self.refreshExchange = function (exchange) {
    changerService.refreshExchange(exchange).then((exchange) => {
      self.exchangeHistory = changerService.getHistory();
    });
  };

  self.exchangeArkNow = function (transaction) {
    networkService.postTransaction(transaction).then(
      (transaction) => {
        self.exchangeSell.sentTransaction = transaction;
        $mdToast.show(
          $mdToast.simple()
            .textContent(`${gettextCatalog.getString('Transaction')} ${transaction.id} ${gettextCatalog.getString('sent with success!')}`)
            .hideDelay(5000),
        );
      },
      formatAndToastError,
    );
  };

  self.cancelExchange = function () {
    if (self.exchangeBuy) {
      changerService.cancelExchange(self.exchangeBuy);
      self.exchangeBuy = null;
      self.exchangeTransactionId = null;
    }
    if (self.exchangeSell) {
      changerService.cancelExchange(self.exchangeSell);
      self.exchangeTransaction = null;
      self.exchangeSell = null;
    }
  };

  self.getCoins = function () {
    console.log();
    return changerService.getCoins();
  };

  // Load all registered accounts
  self.accounts = accountService.loadAllAccounts();

  // *********************************
  // Internal methods
  // *********************************

  /**
   * Hide or Show the 'left' sideNav area
   */
  function toggleAccountsList() {
    if ($mdMedia('md') || $mdMedia('sm')) $mdSidenav('left').toggle();
  }
  self.myAccounts = function () {
    return self.accounts.filter(account => !!account.virtual).sort((a, b) => b.balance - a.balance);
  };

  self.myAccountsBalance = function () {
    return (self.myAccounts().reduce((memo, acc) => memo + parseInt(acc.balance), 0) / 100000000).toFixed(2);
  };

  self.otherAccounts = function () {
    return self.accounts.filter(account => !account.virtual).sort((a, b) => b.balance - a.balance);
  };

  self.openMenu = function ($mdMenuOpen, ev) {
    const originatorEv = ev;
    $mdMenuOpen(ev);
  };


  self.changeCurrency = function () {
    const currencies = [
      { name: 'btc', symbol: 'Ƀ' },
      { name: 'usd', symbol: '$' },
      { name: 'eur', symbol: '€' },
      { name: 'cny', symbol: 'CN¥' },
      { name: 'cad', symbol: 'Can$' },
      { name: 'gbp', symbol: '£' },
      { name: 'hkd', symbol: 'HK$' },
      { name: 'jpy', symbol: 'JP¥' },
      { name: 'rub', symbol: '\u20BD' },
      { name: 'aud', symbol: 'A$' },
    ];
    self.currency = currencies[currencies.map(x => x.name).indexOf(self.currency.name) + 1];
    if (self.currency === undefined) self.currency = currencies[0];
    storageService.set('currency', self.currency);
  };

  self.pickRandomPeer = function () {
    networkService.pickRandomPeer();
  };

  self.getDefaultValue = function (account) {
    let amount = account.balance;
    if (account.virtual) {
      for (const folder in account.virtual) {
        if (account.virtual[folder].amount) {
          amount -= account.virtual[folder].amount;
        }
      }
    }
    return amount;
  };

  self.saveFolder = function (account, folder) {
    accountService.setToFolder(account.address, folder, account.virtual.uservalue(folder)() * 100000000);
  };

  self.deleteFolder = function (account, foldername) {
    account.virtual = accountService.deleteFolder(account.address, foldername);
  };

  self.createFolder = function (account) {
    if (account.virtual) {
      const confirm = $mdDialog.prompt()
        .title(gettextCatalog.getString('Create Virtual Folder'))
        .textContent(gettextCatalog.getString('Please enter a folder name.'))
        .placeholder(gettextCatalog.getString('folder name'))
        .ariaLabel(gettextCatalog.getString('Folder Name'))
        .ok(gettextCatalog.getString('Add'))
        .cancel(gettextCatalog.getString('Cancel'));
      $mdDialog.show(confirm).then((foldername) => {
        account.virtual = accountService.setToFolder(account.address, foldername, 0);
        $mdToast.show(
          $mdToast.simple()
            .textContent(gettextCatalog.getString('Virtual folder added!'))
            .hideDelay(3000),
        );
      });
    } else {
      const confirm = $mdDialog.prompt()
        .title(gettextCatalog.getString('Login'))
        .textContent(gettextCatalog.getString('Please enter this account passphrase to login.'))
        .placeholder(gettextCatalog.getString('passphrase'))
        .ariaLabel(gettextCatalog.getString('Passphrase'))
        .ok(gettextCatalog.getString('Login'))
        .cancel(gettextCatalog.getString('Cancel'));
      $mdDialog.show(confirm).then((passphrase) => {
        accountService.createVirtual(passphrase).then((virtual) => {
          account.virtual = virtual;
          $mdToast.show(
            $mdToast.simple()
              .textContent(gettextCatalog.getString('Succesfully Logged In!'))
              .hideDelay(3000),
          );
        }, (err) => {
          $mdToast.show(
            $mdToast.simple()
              .textContent(gettextCatalog.getString('Error when trying to login: ') + err)
              .hideDelay(3000),
          );
        });
      });
    }
  };

  function gotoAddress(address) {
    const currentaddress = address;
    accountService.fetchAccountAndForget(currentaddress).then((a) => {
      self.selected = a;
      if (self.selected.delegates) {
        self.selected.selectedVotes = self.selected.delegates.slice(0);
      } else self.selected.selectedVotes = [];
      accountService
        .refreshAccount(self.selected)
        .then((account) => {
          if (self.selected.address === currentaddress) {
            self.selected.balance = account.balance;

            if (!self.selected.virtual) self.selected.virtual = account.virtual;
          }
        });
      accountService
        .getTransactions(currentaddress)
        .then((transactions) => {
          if (self.selected.address === currentaddress) {
            if (!self.selected.transactions) {
              self.selected.transactions = transactions;
            } else {
              transactions = transactions.sort((a, b) => b.timestamp - a.timestamp);

              const previousTx = self.selected.transactions;
              self.selected.transactions = transactions;

              // if the previous tx was unconfirmed, rebroadcast and put it back at the top (for better UX)
              if (previousTx.length && !previousTx[0].confirmations && previousTx[0].id !== transactions[0].id) {
                networkService.broadcastTransaction(previousTx[0]);
                self.selected.transactions.unshift(previousTx[0]);
              }
            }
          }
        });
      accountService
        .getVotedDelegates(self.selected.address)
        .then((delegates) => {
          if (self.selected.address === currentaddress) {
            self.selected.delegates = delegates;
            self.selected.selectedVotes = delegates.slice(0);
          }
        });
      accountService
        .getDelegate(self.selected.publicKey)
        .then((delegate) => {
          if (self.selected.address === currentaddress) {
            self.selected.delegate = delegate;
          }
        });
    });
  }


  function refreshCurrentAccount() {
    const myaccount = self.selected;
    accountService
      .refreshAccount(myaccount)
      .then((account) => {
        if (self.selected.address === myaccount.address) {
          self.selected.balance = account.balance;
          if (!self.selected.virtual) self.selected.virtual = account.virtual;
        }
      });
    accountService
      .getTransactions(myaccount.address)
      .then((transactions) => {
        if (self.selected.address === myaccount.address) {
          if (!self.selected.transactions) {
            self.selected.transactions = transactions;
          } else {
            transactions = transactions.sort((a, b) => b.timestamp - a.timestamp);

            const previousTx = self.selected.transactions;
            self.selected.transactions = transactions;

            const playSong = storageService.get('playFundsReceivedSong');
            if (playSong === true && transactions.length > previousTx.length && transactions[0].type === 0 && transactions[0].recipientId === myaccount.address) {
              const wavFile = require('path').resolve(__dirname, 'assets/audio/power-up.wav');
              const audio = new Audio(wavFile);
              audio.play();
            }

            // if the previous tx was unconfirmed, put it back at the top (for better UX)
            if (previousTx.length && !previousTx[0].confirmations && previousTx[0].id !== transactions[0].id) {
              networkService.broadcastTransaction(previousTx[0]);
              self.selected.transactions.unshift(previousTx[0]);
            }
          }
        }
      });
  }

  self.refreshAccountBalances = function () {
    networkService.getPrice();
    for (const i in self.accounts) {
      accountService
        .refreshAccount(self.accounts[i])
        .then((account) => {
          for (const j in self.accounts) {
            if (self.accounts[j].address === account.address) {
              self.accounts[j].balance = account.balance;
            }
          }
        });
    }
  };

  function togglePlayFundsReceivedSong(status) {
    storageService.set('playFundsReceivedSong', self.playFundsReceivedSong, true);
  }

  /**
   * Select the current avatars
   * @param menuId
   */
  function selectAccount(account) {
    const currentaddress = account.address;
    self.selected = accountService.getAccount(currentaddress);
    console.log(self.selected);
    loadSignedMessages();
    if (!self.selected.selectedVotes) {
      if (self.selected.delegates) {
        self.selected.selectedVotes = self.selected.delegates.slice(0);
      } else self.selected.selectedVotes = [];
    }
    accountService
      .refreshAccount(self.selected)
      .then((account) => {
        if (self.selected.address === currentaddress) {
          self.selected.balance = account.balance;

          if (!self.selected.virtual) self.selected.virtual = account.virtual;
        }
      });
    accountService
      .getTransactions(currentaddress)
      .then((transactions) => {
        if (self.selected.address === currentaddress) {
          if (!self.selected.transactions) {
            self.selected.transactions = transactions;
          } else {
            transactions = transactions.sort((a, b) => b.timestamp - a.timestamp);

            const previousTx = self.selected.transactions;
            self.selected.transactions = transactions;

            const playSong = storageService.get('playFundsReceivedSong');
            if (playSong === true && transactions.length > previousTx.length && transactions[0].type === 0 && transactions[0].recipientId === myaccount.address) {
              const wavFile = require('path').resolve(__dirname, 'assets/audio/power-up.wav');
              const audio = new Audio(wavFile);
              audio.play();
            }

            // if the previous tx was unconfirmed, but it back at the top (for better UX)
            if (previousTx.length && !previousTx[0].confirmations && previousTx[0].id !== transactions[0].id) {
              networkService.broadcastTransaction(previousTx[0]);
              self.selected.transactions.unshift(previousTx[0]);
            }
          }
        }
      });
    accountService
      .getVotedDelegates(self.selected.address)
      .then((delegates) => {
        if (self.selected.address === currentaddress) {
          self.selected.delegates = delegates;
          self.selected.selectedVotes = delegates.slice(0);
        }
      });
    accountService
      .getDelegate(self.selected.publicKey)
      .then((delegate) => {
        if (self.selected.address === currentaddress) {
          self.selected.delegate = delegate;
        }
      });
  }

  /**
   * Add an account
   */
  function addWatchOnlyAddress() {
    function cancel() {
      $mdDialog.hide();
    }

    function validateAddress() {
      const isAddress = /^[1-9A-Za-z]+$/g;
      const address = $scope.address;
      if (isAddress.test(address)) {
        accountService.fetchAccount(address).then((account) => {
          self.accounts.push(account);
          selectAccount(account);
          $mdToast.show(
            $mdToast.simple()
              .textContent(gettextCatalog.getString('Account added!'))
              .hideDelay(3000),
          );
        });
        cancel();
      } else {
        $mdToast.show(
          $mdToast.simple()
            .textContent(`${gettextCatalog.getString('Address')} ${address} ${gettextCatalog.getString('is not recognised')}`)
            .hideDelay(3000),
        );
      }
    }

    $scope.send = {
      cancel,
      validateAddress,
    };
    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/addWatchOnlyAddress.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
      fullscreen: true,
    });
  }

  function getAllDelegates(selectedAccount) {
    function arrayUnique(array) {
      const a = array.concat();
      for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
          if (a[i] && a[i].username === a[j].username) { a.splice(j--, 1); }
        }
      }
      return a;
    }
    if (selectedAccount.selectedVotes) {
      return arrayUnique(selectedAccount.selectedVotes.concat(selectedAccount.delegates));
    }
    return selectedAccount.delegates;
  }
  function addDelegate(selectedAccount) {
    const data = { fromAddress: selectedAccount.address, delegates: [], registeredDelegates: {} };
    accountService.getActiveDelegates().then((r) => { data.registeredDelegates = r; });

    function add() {
      function indexOfDelegates(array, item) {
        for (const i in array) {
          if (array[i].username === item.username) {
            console.log(array[i]);
            return i;
          }
        }
        return -1;
      }
      $mdDialog.hide();
      accountService.getDelegateByUsername(data.delegatename).then(
        (delegate) => {
          if (self.selected.selectedVotes.length < 101 && indexOfDelegates(selectedAccount.selectedVotes, delegate) < 0) {
            selectedAccount.selectedVotes.push(delegate);
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent(gettextCatalog.getString('List full or delegate already voted.'))
                .hideDelay(5000),
            );
          }
        },
        formatAndToastError,
      );
    }
    function addSponsors() {
      function indexOfDelegates(array, item) {
        for (const i in array) {
          if (array[i].username === item.username) {
            console.log(array[i]);
            return i;
          }
        }
        return -1;
      }
      $mdDialog.hide();
      accountService.getSponsors().then(
        (sponsors) => {
          // check if sponsors are already voted
          if (self.selected.delegates) {
            const newsponsors = [];
            for (let i = 0; i < sponsors.length; i++) {
              console.log(sponsors[i]);
              if (indexOfDelegates(self.selected.delegates, sponsors[i]) < 0) {
                newsponsors.push(sponsors[i]);
              }
            }
            sponsors = newsponsors;
          }

          for (let i = 0; i < sponsors.length; i++) {
            if (self.selected.selectedVotes.length < 101 && indexOfDelegates(selectedAccount.selectedVotes, sponsors[i]) < 0) {
              selectedAccount.selectedVotes.push(sponsors[i]);
            }
          }
        },
        formatAndToastError,
      );
    }
    function cancel() {
      $mdDialog.hide();
    }
    $scope.addDelegateDialog = {
      data,
      cancel,
      add,
      addSponsors,
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/addDelegate.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
    });
  }
  function vote(selectedAccount) {
    let votes = accountService.createDiffVote(selectedAccount.address, selectedAccount.selectedVotes);
    if (!votes || votes.length === 0) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(gettextCatalog.getString('No difference from original delegate list'))
          .hideDelay(5000),
      );
      return;
    }
    votes = votes[0];
    const passphrases = accountService.getPassphrases(selectedAccount.address);
    const data = {
      ledger: selectedAccount.ledger,
      fromAddress: selectedAccount ? selectedAccount.address : '',
      secondSignature: selectedAccount ? selectedAccount.secondSignature : '',
      passphrase: passphrases[0] ? passphrases[0] : '',
      secondpassphrase: passphrases[1] ? passphrases[1] : '',
      votes,
    };
    function next() {
      $mdDialog.hide();
      const publicKeys = $scope.voteDialog.data.votes.map(delegate => delegate.vote + delegate.publicKey).join(',');
      console.log(publicKeys);
      accountService.createTransaction(3,
        {
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          fromAddress: $scope.voteDialog.data.fromAddress,
          publicKeys,
          masterpassphrase: $scope.voteDialog.data.passphrase,
          secondpassphrase: $scope.voteDialog.data.secondpassphrase,
        },
      ).then(
        (transaction) => {
          validateTransaction(selectedAccount, transaction);
        },
        formatAndToastError,
      );
    }
    function cancel() {
      $mdDialog.hide();
    }
    $scope.voteDialog = {
      data,
      cancel,
      next,
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/vote.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
    });
  }
  function timestamp(selectedAccount) {
    const passphrases = accountService.getPassphrases(selectedAccount.address);
    const data = {
      ledger: selectedAccount.ledger,
      fromAddress: selectedAccount ? selectedAccount.address : '',
      secondSignature: selectedAccount ? selectedAccount.secondSignature : '',
      passphrase: passphrases[0] ? passphrases[0] : '',
      secondpassphrase: passphrases[1] ? passphrases[1] : '',
    };

    function next() {
      // remove bad characters before and after in case of bad copy/paste
      $scope.send.data.passphrase = $scope.send.data.passphrase.trim();
      if ($scope.send.data.secondpassphrase) {
        $scope.send.data.secondpassphrase = $scope.send.data.secondpassphrase.trim();
      }

      $mdDialog.hide();
      const smartbridge = `timestamp:${$scope.send.data.smartbridge}`;
      console.log(smartbridge);
      accountService.createTransaction(0,
        {
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          fromAddress: $scope.send.data.fromAddress,
          toAddress: $scope.send.data.fromAddress,
          amount: 1,
          smartbridge,
          masterpassphrase: $scope.send.data.passphrase,
          secondpassphrase: $scope.send.data.secondpassphrase,
        },
      ).then(
        (transaction) => {
          validateTransaction(selectedAccount, transaction);
        },
        formatAndToastError,
      );
    }
    function openFile() {
      const crypto = require('crypto');
      const fs = require('fs');

      require('electron').remote.dialog.showOpenDialog((fileNames) => {
        if (fileNames === undefined) return;
        const fileName = fileNames[0];
        const algo = 'sha256';
        const shasum = crypto.createHash(algo);
        $scope.send.data.filename = fileName;
        $scope.send.data.smartbridge = 'Calculating signature....';
        const s = fs.ReadStream(fileName);

        s.on('data', (d) => { shasum.update(d); });
        s.on('end', () => {
          $scope.send.data.smartbridge = shasum.digest('hex');
        });
      });
    }
    function cancel() {
      $mdDialog.hide();
    }
    $scope.send = {
      data,
      openFile,
      cancel,
      next,
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/timestampDocument.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
    });
  }
  function sendArk(selectedAccount) {
    const passphrases = accountService.getPassphrases(selectedAccount.address);
    const data = {
      ledger: selectedAccount.ledger,
      fromAddress: selectedAccount ? selectedAccount.address : '',
      secondSignature: selectedAccount ? selectedAccount.secondSignature : '',
      passphrase: passphrases[0] ? passphrases[0] : '',
      secondpassphrase: passphrases[1] ? passphrases[1] : '',
    };

    // testing goodies
    // let data={
    //   fromAddress: selectedAccount ? selectedAccount.address: '',
    //   secondSignature: selectedAccount ? selectedAccount.secondSignature: '',
    //   passphrase: 'insect core ritual alcohol clinic opera aisle dial entire dust symbol vintage',
    //   secondpassphrase: passphrases[1] ? passphrases[1] : '',
    //   toAddress: 'AYxKh6vwACWicSGJATGE3rBreFK7whc7YA',
    //   amount: 1,
    // };
    const totalBalance = function (minusFee) {
      const fee = 10000000;
      const balance = selectedAccount.balance;
      return accountService.numberToFixed((minusFee ? balance - fee : balance) / 100000000);
    };

    function fillSendableBalance() {
      const sendableBalance = totalBalance(true);
      $scope.send.data.amount = sendableBalance > 0 ? sendableBalance : 0;
    }

    function next() {
      if (!$scope.sendArkForm.$valid) {
        return;
      }

      // in case of data selected from contacts
      if ($scope.send.data.toAddress.address) {
        $scope.send.data.toAddress = $scope.send.data.toAddress.address;
      }
      // remove bad characters before and after in case of bad copy/paste
      $scope.send.data.toAddress = $scope.send.data.toAddress.trim();
      $scope.send.data.passphrase = $scope.send.data.passphrase.trim();
      if ($scope.send.data.secondpassphrase) {
        $scope.send.data.secondpassphrase = $scope.send.data.secondpassphrase.trim();
      }

      $mdDialog.hide();
      accountService.createTransaction(0,
        {
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          fromAddress: $scope.send.data.fromAddress,
          toAddress: $scope.send.data.toAddress,
          amount: parseInt($scope.send.data.amount * 100000000),
          smartbridge: $scope.send.data.smartbridge,
          masterpassphrase: $scope.send.data.passphrase,
          secondpassphrase: $scope.send.data.secondpassphrase,
        },
      ).then(
        (transaction) => {
          console.log(transaction);
          validateTransaction(selectedAccount, transaction);
        },
        formatAndToastError,
      );
    }
    function searchTextChange(text) {
      $scope.send.data.toAddress = text;
    }

    function selectedContactChange(contact) {
      if (contact) {
        $scope.send.data.toAddress = contact.address;
      }
    }

    function querySearch(text) {
      text = text.toLowerCase();
      const contacts = storageService.get('contacts');
      if (!contacts) {
        return [];
      }
      return contacts.filter(account => (account.address.toLowerCase().indexOf(text) > -1) || (account.name && (account.name.toLowerCase().indexOf(text) > -1)));
    }

    function cancel() {
      $mdDialog.hide();
    }
    function checkContacts(input) {
      // I have commented this out as it does nothing
      // if(input[0] !== "@") return;
    }
    $scope.send = {
      data,
      cancel,
      next,
      checkContacts,
      searchTextChange,
      selectedContactChange,
      querySearch,
      fillSendableBalance,
      totalBalance: totalBalance(false),
      remainingBalance: totalBalance(false), // <-- initial value, this will change by directive
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/sendArk.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
    });
  }
  function manageBackgrounds() {
    const fs = require('fs');
    const path = require('path');
    const context = storageService.getContext();
    const currentNetwork = networkService.getNetwork();
    const initialBackground = currentNetwork.background;

    const backgrounds = {
      colors: {
        Midnight: '#2c3e50',
        Asbestos: '#7f8c8d',
        Wisteria: '#674172',
        'Belize Hole': '#2980b9',
      },
      textures: {},
      images: {},
    };

    const imgPath = 'assets/img';
    const assetsPath = path.resolve(__dirname, imgPath);

    // find files in directory with same key
    for (const folder in backgrounds) {
      const fullPath = path.resolve(assetsPath, folder);

      if (fs.existsSync(path.resolve(fullPath))) { // check dir exists
        const image = {};
        fs.readdirSync(fullPath).forEach((file) => {
          const stat = fs.statSync(path.join(fullPath, file)); // to prevent if directory

          if (stat.isFile()) {
            let url = path.join(imgPath, folder, file); // ex: assets/img/textures/file.png
            url = url.replace(/\\/g, '/');
            const name = path.parse(file).name; // remove extension
            image[name] = `url('${url}')`;
          }
        });
        backgrounds[folder] = image;
      }
    }
    function select(background) {
      $scope.send.selected = background;
      currentNetwork.background = background;
    }

    function save() {
      $mdDialog.hide();
      networkService.setNetwork(context, currentNetwork);
      window.location.reload();
    }
    function cancel() {
      $mdDialog.hide();
      currentNetwork.background = initialBackground;
    }
    $scope.send = {
      cancel,
      save,
      backgroundKeys: Object.keys(backgrounds),
      backgrounds,
      select,
      selected: initialBackground,
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/manageBackground.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
      fullscreen: true,
    });
  }
  function manageNetworks() {
    let networks = networkService.getNetworks();

    function save() {
      // these are not needed as the createNetwork now rerender automatically
      $mdDialog.hide();
      for (const network in $scope.send.networks) {
        networkService.setNetwork(network, $scope.send.networks[network]);
      }
      // window.location.reload();
    }
    function cancel() {
      $mdDialog.hide();
    }
    function refreshTabs() {
      // reload networks
      networks = networkService.getNetworks();
      // add it back to the scope
      $scope.send.networkKeys = Object.keys(networks);
      $scope.send.networks = networks;
      // tell angular that the list changed
      $scope.$apply();
    }

    function createNetwork() {
      networkService.createNetwork($scope.send.createnetwork).then(
        (network) => {
          refreshTabs();
        },
        formatAndToastError,
      );
    }
    function removeNetwork(network) {
      networkService.removeNetwork(network);
      refreshTabs();
    }

    $scope.send = {
      networkKeys: Object.keys(networks),
      networks,
      createNetwork,
      removeNetwork,
      cancel,
      save,
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/manageNetwork.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
      fullscreen: true,
    });
  }
  function openPassphrasesDialog(selectedAccount) {
    const passphrases = accountService.getPassphrases(selectedAccount.address);
    const data = { address: selectedAccount.address, passphrase: passphrases[0], secondpassphrase: passphrases[1] };
    function save() {
      $mdDialog.hide();
      accountService.savePassphrases($scope.send.data.address, $scope.send.data.passphrase, $scope.send.data.secondpassphrase).then(
        (account) => {
          $mdToast.show(
            $mdToast.simple()
              .textContent(gettextCatalog.getString('Passphrases saved'))
              .hideDelay(5000),
          );
        },
        formatAndToastError,
      );
    }
    function cancel() {
      $mdDialog.hide();
    }
    $scope.send = {
      data,
      cancel,
      save,
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/savePassphrases.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
    });
  }
  // register as delegate
  function createDelegate(selectedAccount) {
    const passphrases = accountService.getPassphrases(selectedAccount.address);
    const data = {
      ledger: selectedAccount.ledger,
      fromAddress: selectedAccount.address,
      username: '',
      secondSignature: selectedAccount.secondSignature,
      passphrase: passphrases[0] ? passphrases[0] : '',
      secondpassphrase: passphrases[1] ? passphrases[1] : '',
    };

    function next() {
      $mdDialog.hide();

      let delegateName;
      try {
        delegateName = accountService.sanitizeDelegateName($scope.createDelegate.data.username);
      } catch (error) {
        return formatAndToastError(error);
      }

      accountService.createTransaction(2,
        {
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          fromAddress: $scope.createDelegate.data.fromAddress,
          username: delegateName,
          masterpassphrase: $scope.createDelegate.data.passphrase,
          secondpassphrase: $scope.createDelegate.data.secondpassphrase,
        },
      ).then(
        (transaction) => {
          validateTransaction(selectedAccount, transaction);
        },
        formatAndToastError,
      );
    }
    function cancel() {
      $mdDialog.hide();
    }
    $scope.createDelegate = {
      data,
      cancel,
      next,
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/createDelegate.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
    });
  }
  // Create a new cold account
  function createAccount() {
    const bip39 = require('bip39');
    const data = { passphrase: bip39.generateMnemonic() };

    function next() {
      if (!$scope.createAccountDialog.data.showRepassphrase) {
        $scope.createAccountDialog.data.repassphrase = $scope.createAccountDialog.data.passphrase;
        $scope.createAccountDialog.data.passphrase = '';
        $scope.createAccountDialog.data.showRepassphrase = true;
      } else {
        if (!$scope.createAccountForm.$valid) {
          return;
        }

        const words = $scope.createAccountDialog.data.repassphrase.split(' ');
        if ($scope.createAccountDialog.data.word3 === words[2] && $scope.createAccountDialog.data.word6 === words[5] && $scope.createAccountDialog.data.word9 === words[8]) {
          accountService.createAccount($scope.createAccountDialog.data.repassphrase).then((account) => {
            self.accounts.push(account);
            $mdToast.show(
              $mdToast.simple()
                .textContent(gettextCatalog.getString('Account successfully created: ') + account.address)
                .hideDelay(5000),
            );
            selectAccount(account);
          });
          $mdDialog.hide();
        } else {
          $scope.createAccountDialog.data.showWrongRepassphrase = true;
        }
      }
    }
    function querySearch(text) {
      text = text.toLowerCase();
      return self.accounts.filter(account => (account.address.toLowerCase().indexOf(text) > -1) || (account.username && (account.username.toLowerCase().indexOf(text) > -1)));
    }

    function cancel() {
      $mdDialog.hide();
    }
    $scope.createAccountDialog = {
      data,
      cancel,
      next,
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/createAccount.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
    });
  }
  function importAccount() {
    const data = {
      passphrase: '',
      // TODO second passphrase
      // secondpassphrase: ''
    };

    function save() {
      if (!$scope.importAccountForm.$valid) {
        return;
      }

      accountService.createAccount($scope.send.data.passphrase)
        .then(
          (account) => {
          // Check for already imported account
            for (let i = 0; i < self.accounts.length; i++) {
              if (self.accounts[i].address === account.address) {
                $mdToast.show(
                  $mdToast.simple()
                    .textContent(gettextCatalog.getString('Account was already imported: ') + account.address)
                    .hideDelay(5000),
                );
                return selectAccount(account);
              }
            }

            self.accounts.push(account);
            $mdToast.show(
              $mdToast.simple()
                .textContent(gettextCatalog.getString('Account successfully imported: ') + account.address)
                .hideDelay(5000),
            );
            selectAccount(account);
          // TODO save passphrases after we have local encrytion
          },
          formatAndToastError,
        );
      $mdDialog.hide();
    }
    function cancel() {
      $mdDialog.hide();
    }
    $scope.send = {
      data,
      cancel,
      save,
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/importAccount.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
    });
  }
  // Add a second passphrase to an account
  function createSecondPassphrase(account) {
    const bip39 = require('bip39');
    const data = { secondPassphrase: bip39.generateMnemonic() };

    if (account.secondSignature) {
      return formatAndToastError(
        gettextCatalog.getString(`This account already has a second passphrase: ${account.address}`),
      );
    }

    function next() {
      if (!$scope.createSecondPassphraseDialog.data.showRepassphrase) {
        $scope.createSecondPassphraseDialog.data.reSecondPassphrase = $scope.createSecondPassphraseDialog.data.secondPassphrase;
        $scope.createSecondPassphraseDialog.data.secondPassphrase = '';
        $scope.createSecondPassphraseDialog.data.showRepassphrase = true;
      } else if ($scope.createSecondPassphraseDialog.data.reSecondPassphrase !== $scope.createSecondPassphraseDialog.data.secondPassphrase) {
        $scope.createSecondPassphraseDialog.data.showWrongRepassphrase = true;
      } else {
        accountService.createTransaction(1,
          {
            fromAddress: account.address,
            masterpassphrase: $scope.createSecondPassphraseDialog.data.passphrase,
            secondpassphrase: $scope.createSecondPassphraseDialog.data.reSecondPassphrase,
          },
        ).then(
          (transaction) => {
            networkService.postTransaction(transaction).then(
              (transaction) => {
                $mdToast.show(
                  $mdToast.simple()
                    .textContent(gettextCatalog.getString('Second Passphrase added successfully: ') + account.address)
                    .hideDelay(5000),
                );
              },
              formatAndToastError,
            );
          },
          formatAndToastError,
        );
        $mdDialog.hide();
      }
    }
    function cancel() {
      $mdDialog.hide();
    }
    $scope.createSecondPassphraseDialog = {
      data,
      cancel,
      next,
    };

    $mdDialog.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/createSecondPassphrase.html',
      clickOutsideToClose: false,
      preserveScope: true,
      scope: $scope,
    });
  }
  /**
   * Show the Contact view in the bottom sheet
   */
  function showAccountMenu(selectedAccount) {
    const account = selectedAccount;

    const items = [
      { name: gettextCatalog.getString('Open in explorer'), icon: 'open_in_new' },
      { name: gettextCatalog.getString('Remove'), icon: 'clear' },
    ];

    if (!selectedAccount.delegate) {
      items.push({ name: gettextCatalog.getString('Label'), icon: 'local_offer' });
      items.push({ name: gettextCatalog.getString('Register Delegate'), icon: 'perm_identity' });
    }

    items.push({ name: gettextCatalog.getString('Timestamp Document'), icon: 'verified_user' });

    if (!selectedAccount.secondSignature) {
      items.push({ name: gettextCatalog.getString('Second Passphrase'), icon: 'lock' });
    }

    function answer(action) {
      $mdBottomSheet.hide();

      if (action === gettextCatalog.getString('Open in explorer')) {
        openExplorer(`/address/${selectedAccount.address}`);
      }

      if (action === gettextCatalog.getString('Timestamp Document')) {
        timestamp(selectedAccount);
      } else if (action === gettextCatalog.getString('Remove')) {
        const confirm = $mdDialog.confirm()
          .title(`${gettextCatalog.getString('Remove Account')} ${account.address}`)
          .textContent(gettextCatalog.getString('Remove this account from your wallet. ' +
                'The account may be added again using the original passphrase of the account.'))
          .ok(gettextCatalog.getString('Remove account'))
          .cancel(gettextCatalog.getString('Cancel'));
        $mdDialog.show(confirm).then(() => {
          accountService.removeAccount(account).then(() => {
            self.accounts = accountService.loadAllAccounts();

            if (self.accounts.length > 0) {
              selectAccount(self.accounts[0]);
            } else {
              self.selected = null;
            }

            $mdToast.show(
              $mdToast.simple()
                .textContent(gettextCatalog.getString('Account removed!'))
                .hideDelay(3000),
            );
          });
        });
      } else if (action === gettextCatalog.getString('Send Ark')) {
        sendArk();
      } else if (action === gettextCatalog.getString('Register Delegate')) {
        createDelegate(selectedAccount);
      } else if (action === gettextCatalog.getString('Label')) {
        const prompt = $mdDialog.prompt()
          .title(gettextCatalog.getString('Label'))
          .textContent(gettextCatalog.getString('Please enter a short label.'))
          .placeholder(gettextCatalog.getString('label'))
          .ariaLabel(gettextCatalog.getString('Label'))
          .ok(gettextCatalog.getString('Set'))
          .cancel(gettextCatalog.getString('Cancel'));
        $mdDialog.show(prompt).then((label) => {
          accountService.setUsername(selectedAccount.address, label);
          self.accounts = accountService.loadAllAccounts();
          $mdToast.show(
            $mdToast.simple()
              .textContent(gettextCatalog.getString('Label set'))
              .hideDelay(3000),
          );
        });
      } else if (action === gettextCatalog.getString('Second Passphrase')) {
        createSecondPassphrase(account);
      }
    }
    $scope.bs = {
      address: account.address,
      answer,
      items,
    };

    $mdBottomSheet.show({
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/contactSheet.html',
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope,
    });
  }
  function loadSignedMessages() {
    self.selected.signedMessages = storageService.get(`signed-${self.selected.address}`);
  }

  self.deleteSignedMessage = function (selectedAccount, signedMessage) {
    const index = selectedAccount.signedMessages.indexOf(signedMessage);
    selectedAccount.signedMessages.splice(index, index + 1);
    storageService.set(`signed-${selectedAccount.address}`, selectedAccount.signedMessages);
  };

  function showMessage(message) {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.getElementById('app')))
        .clickOutsideToClose(true)
        .title(message)
        .ariaLabel(message)
        .ok(gettextCatalog.getString('Ok')),
    );
  }

  self.signMessage = function (selectedAccount) {
    console.log(selectedAccount);

    function sign() {
      const address = $scope.sign.selectedAccount.address;
      const passphrase = $scope.sign.passphrase;
      const message = $scope.sign.message;
      if (!selectedAccount.signedMessages) {
        selectedAccount.signedMessages = [];
      }
      let promisedSignature = null;
      if (selectedAccount.ledger) {
        promisedSignature = accountService.signMessageWithLedger(message, selectedAccount.ledger);
      } else {
        promisedSignature = accountService.signMessage(message, passphrase);
      }

      promisedSignature.then(
        (result) => {
          selectedAccount.signedMessages.push({
            publickey: selectedAccount.publicKey,
            signature: result.signature,
            message,
          });
          storageService.set(`signed-${selectedAccount.address}`, selectedAccount.signedMessages);
          $mdDialog.hide();
        },
        (error) => {
          showMessage(error);
        },
      );
    }
    function cancel() {
      $mdDialog.hide();
    }
    const passphrases = accountService.getPassphrases(selectedAccount.address);

    $scope.sign = {
      passphrase: passphrases[0] ? passphrases[0] : '',
      sign,
      cancel,
      selectedAccount,
    };

    $mdDialog.show({
      scope: $scope,
      preserveScope: true,
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/signMessage.html',
      clickOutsideToClose: false,
    });
  };

  self.verifyMessage = function (signedMessage) {
    function verify() {
      console.log($scope.verify);
      const message = $scope.verify.message;
      const publickey = $scope.verify.publickey;
      const signature = $scope.verify.signature;
      const res = accountService.verifyMessage(message, publickey, signature);
      $mdDialog.hide();
      let strMessage = gettextCatalog.getString('Error in signature processing');
      if (res === true) {
        strMessage = gettextCatalog.getString('The message is verified successfully');
      } else {
        strMessage = gettextCatalog.getString('The message is NOT verified');
      }
      showMessage(strMessage, res);
    }
    function cancel() {
      $mdDialog.hide();
    }
    if (signedMessage) {
      $scope.verify = signedMessage;
      verify();
    } else {
      $scope.verify = {
        verify,
        cancel,
        publickey: self.selected.publicKey,
      };

      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        parent: angular.element(document.getElementById('app')),
        templateUrl: 'accounts/view/verifyMessage.html',
        clickOutsideToClose: false,
      });
    }
  };

  function validateTransaction(selectedAccount, transaction) {
    function send() {
      $mdDialog.hide();

      transaction = accountService.formatTransaction(transaction, selectedAccount.address);
      transaction.confirmations = 0;
      selectedAccount.transactions.unshift(transaction);

      networkService.postTransaction(transaction).then(
        (transaction) => {
          $mdToast.show(
            $mdToast.simple()
              .textContent(`${gettextCatalog.getString('Transaction')} ${transaction.id} ${gettextCatalog.getString('sent with success!')}`)
              .hideDelay(5000),
          );
        },
        formatAndToastError,
      );
    }
    function cancel() {
      $mdDialog.hide();
    }
    $scope.validate = {
      send,
      cancel,
      transaction,
      // to avoid small transaction to be displayed as 1e-8
      humanAmount: `${accountService.numberToFixed(transaction.amount / 100000000)}`,
    };

    $mdDialog.show({
      scope: $scope,
      preserveScope: true,
      parent: angular.element(document.getElementById('app')),
      templateUrl: 'accounts/view/showTransaction.html',
      clickOutsideToClose: false,
    });
  }
}

angular.module('arkclient.accounts')
  .controller('AccountController', ['accountService', 'networkService', 'storageService',
    'changerService', 'ledgerService', '$mdToast', '$mdSidenav', '$mdBottomSheet', '$timeout',
    '$interval', '$log', '$mdDialog', '$scope', '$mdMedia', 'gettextCatalog', AccountController,
  ]);
