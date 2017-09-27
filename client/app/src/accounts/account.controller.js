(function() {
  angular
    .module('arkclient.accounts')
    .controller('AccountController', [
      'accountService',
      'networkService',
      'pluginLoader',
      'storageService',
      'changerService',
      'ledgerService',
      'timeService',
      '$mdToast',
      '$mdSidenav',
      '$mdBottomSheet',
      '$timeout',
      '$interval',
      '$log',
      '$mdDialog',
      '$scope',
      '$mdMedia',
      'gettextCatalog',
      '$mdThemingProvider',
      '$mdTheming',
      '$window',
      AccountController
    ]).filter('accountlabel', ['accountService', function(accountService) {
      return function(address) {
        if (!address)
          return address

        var username = accountService.getUsername(address)
        if (username.match(/^[A|a]{1}[0-9a-zA-Z]{33}$/g))
          return accountService.smallId(username)

        return username
      };
    }]);
  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function AccountController(accountService, networkService, pluginLoader, storageService, changerService, ledgerService, timeService, $mdToast, $mdSidenav, $mdBottomSheet, $timeout, $interval, $log, $mdDialog, $scope, $mdMedia, gettextCatalog, $mdTheming, $mdThemingProvider, $window) {
    var self = this;

    var languages = {
      en: gettextCatalog.getString("English"),
      ar: gettextCatalog.getString("Arabic"),
      bg_BG: gettextCatalog.getString("Bulgarian"),
      de: gettextCatalog.getString("German"),
      el: gettextCatalog.getString("Greek"),
      fi: gettextCatalog.getString("Finish"),
      fr: gettextCatalog.getString("French"),
      hu: gettextCatalog.getString("Hungarish"),
      id: gettextCatalog.getString("Indonesian"),
      it: gettextCatalog.getString("Italian"),
      ja: gettextCatalog.getString("Japanese"),
      ko: gettextCatalog.getString("Korean"),
      nl: gettextCatalog.getString("Dutch"),
      pl: gettextCatalog.getString("Polish"),
      pt_BR: gettextCatalog.getString("Portuguese - Brazil"),
      pt_PT: gettextCatalog.getString("Portuguese - Portugal"),
      ro: gettextCatalog.getString("Romanian"),
      ru: gettextCatalog.getString("Russian"),
      sk: gettextCatalog.getString("Slovak"),
      sl: gettextCatalog.getString("Slovenian"),
      sr: gettextCatalog.getString("Serbian"),
      sv: gettextCatalog.getString("Swedish"),
      zh_CN: gettextCatalog.getString("Chinese - China"),
      zh_TW: gettextCatalog.getString("Chinese - Taiwan")
    };

    pluginLoader.triggerEvent("onStart");

    self.currencies = [
      { name: "usd", symbol: "$" },
      { name: "btc", symbol: "Ƀ" },
      { name: "aud", symbol: "A$" },
      { name: "brl", symbol: "R$" },
      { name: "cad", symbol: "Can$" },
      { name: "chf", symbol: "Fr." },
      { name: "cny", symbol: "CN¥" },
      { name: "eur", symbol: "€" },
      { name: "gbp", symbol: "£" },
      { name: "hkd", symbol: "HK$" },
      { name: "idr", symbol: "Rp" },
      { name: "inr", symbol: "₹" },
      { name: "jpy", symbol: "JP¥" },
      { name: "krw", symbol: "₩" },
      { name: "mxn", symbol: "Mex$" },
      { name: "rub", symbol: '\u20BD' }
    ];

    gettextCatalog.debug = false;
    self.language = storageService.get("language") || "en";
    self.selectedLanguage = self.language;
    gettextCatalog.setCurrentLanguage(self.language);

    self.getLanguage = function() {
      return languages[self.language];
    };

    $window.onbeforeunload = function() {
      storageService.saveState();
    }

    self.closeApp = function() {
      var confirm = $mdDialog.confirm()
        .title(gettextCatalog.getString('Quit Ark Client?'))
        .ok(gettextCatalog.getString('Quit'))
        .cancel(gettextCatalog.getString('Cancel'));
      $mdDialog.show(confirm).then(function() {
        require('electron').remote.app.quit();
      });
    };

    self.windowApp = function(action, args) {
      var curWin = require('electron').remote.getCurrentWindow();
      if (curWin[action])
        return curWin[action](args);
      else return null;
    };

    self.clearData = function() {
      var confirm = $mdDialog.confirm()
        .title(gettextCatalog.getString('Are you sure?'))
        .textContent(gettextCatalog.getString('All your data, including created accounts, networks and contacts will be removed from the app and reset to default.'))
        .ariaLabel(gettextCatalog.getString('Confirm'))
        .ok(gettextCatalog.getString('Yes'))
        .cancel(gettextCatalog.getString('Cancel'));

      $mdDialog.show(confirm).then(function() {
        storageService.clearData();
        self.windowApp('reload');
      });
    };

    self.openExternal = function(url) {
      require('electron').shell.openExternal(url);
    };

    self.openExplorer = openExplorer;
    self.clientVersion = require('../../package.json').version;
    self.latestClientVersion = self.clientVersion;
    networkService.getLatestClientVersion().then(function(r) { self.latestClientVersion = r; });
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
    self.exportAccount = exportAccount;
    self.copiedToClipboard = copiedToClipboard;

    self.playFundsReceivedSound = storageService.get("playFundsReceivedSound") || false;
    self.togglePlayFundsReceivedSound = togglePlayFundsReceivedSound;
    self.manageBackgrounds = manageBackgrounds;
    self.manageNetworks = manageNetworks;
    self.openPassphrasesDialog = openPassphrasesDialog;
    self.createDelegate = createDelegate;
    self.vote = vote;
    self.addDelegate = addDelegate;
    self.showAccountMenu = showAccountMenu;
    self.selectNextLanguage = selectNextLanguage;
    self.currency = storageService.get("currency") || { name: "btc", symbol: "Ƀ" };
    self.switchNetwork = networkService.switchNetwork;
    self.marketinfo = {};
    self.network = networkService.getNetwork();
    self.listNetworks = networkService.getNetworks();
    self.context = storageService.getContext();
    self.exchangeHistory = changerService.getHistory();
    self.selectedCoin = storageService.get("selectedCoin") || "bitcoin_BTC";
    self.exchangeEmail = storageService.get("email") || "";

    self.connectedPeer = { isConnected: false };

    if (!self.network.theme) self.network.theme = 'default';
    if (!self.network.themeDark) self.network.themeDark = false;

    // will be used in view
    self.currentTheme = self.network.theme;

    // set 'dynamic' as the default theme
    generateDynamicPalette(function(name) {
      if (name && self.network.theme == name) {
        self.network.theme = name;
      }
      // generate dark theme after load the dynamic
      generateDarkTheme();
    });

    // set dark mode
    if (self.network.themeDark) self.currentTheme = 'dark';

    //refreshing displayed account every 8s
    $interval(function() {
      if (self.selected) {
        self.refreshCurrentAccount();
      }
    }, 8 * 1000);

    // detect Ledger
    $interval(function() {
      if (!self.ledgerAccounts && self.ledger && self.ledger.connected) {
        self.ledgerAccounts = ledgerService.getBip44Accounts();
      }
      if (ledgerService.detect().status == "Success") {
        self.ledger = ledgerService.isAppLaunched();
        if (!self.ledger.connected) {
          self.ledgerAccounts = null;
        }
      } else {
        self.ledgerAccounts = null;
        self.ledger = { connected: false };
      }
    }, 2 * 1000);

    self.selectLedgerAccount = function(account) {
      if (!account && self.ledgerAccounts) {
        account = self.ledgerAccounts[0];
      }
      if (account) {
        self.selectAccount(account);
      }
    };

    self.connection = networkService.getConnection();

    self.connection.then(
      function() {},
      function() {},
      function(connectedPeer) {
        self.connectedPeer = connectedPeer;

        function showToast(msg) {
          var toast = $mdToast.simple()
            .hideDelay(5000)
            .textContent(gettextCatalog.getString(msg));
          $mdToast.show(toast);
        }

        // Wait a little to ignore the initial connection delay and short interruptions
        $timeout(function() {
          if (! self.connectedPeer.isConnected && self.isNetworkConnected) {
            self.isNetworkConnected = false;
            showToast('Network disconnected!');

          } else if (self.connectedPeer.isConnected && ! self.isNetworkConnected) {
            self.isNetworkConnected = true;
            showToast('Network connected and healthy!');
          }
        }, 500);
      }
    );

    // get themes colors to show in manager appearance
    function reloadThemes() {
      var currentThemes = $mdTheming.$get().THEMES;
      var mapThemes = {};

      Object.keys(currentThemes).forEach(function(theme) {
        var colors = currentThemes[theme].colors;
        var names = [];

        for (var color in colors) {
          names.push('default-' + colors[color].name);
        }

        mapThemes[theme] = names;
      });

      return mapThemes;
    }

    function openExplorer(uri) {
      require('electron').shell.openExternal(self.network.explorer + uri);
    }

    function formatErrorMessage(error) {
      var basicMessage = '';
      if ('string' === typeof error) {
        basicMessage = error;
      } else if ('string' === typeof error.error) {
        basicMessage = error.error;
      } else if ('string' === typeof error.data) {
        basicMessage = error.data;
      } else if ('string' === typeof error.message) {
        basicMessage = error.message;
      }
      var errorMessage = gettextCatalog.getString('Error: ') + basicMessage.replace('Error: ', '');
      console.error(errorMessage, '\n', error);
      return errorMessage;
    }

    function formatAndToastError(error, hideDelay) {
      if (!hideDelay) {
        hideDelay = 5000;
      }
      var errorMessage = formatErrorMessage(error)
      $mdToast.show(
        $mdToast.simple()
        .textContent(errorMessage)
        .hideDelay(hideDelay)
        .theme('error')
      );
    }

    function copiedToClipboard() {
      $mdToast.show(
        $mdToast.simple()
        .textContent(gettextCatalog.getString('Copied to clipboard'))
        .hideDelay(5000)
      );
    }
    self.selectAllLanguages = function() {
      return languages;
    }

    self.setLanguage = function() {
      function getlanguage(value) {
        for (var prop in languages) {
          if (languages.hasOwnProperty(prop)) {
            if (languages[prop] === value)
              return prop;
          }
        }
      }
      self.language = getlanguage(this.selectedLanguage);
      storageService.set("language", self.language);
      gettextCatalog.setCurrentLanguage(self.language);
    }

    //TODO: deprecated
    function selectNextLanguage() {
      var lkeys = Object.keys(languages);
      if (self.language) self.language = lkeys[(lkeys.indexOf(self.language) + 1) % lkeys.length];
      else self.language = "en";
      storageService.set("language", self.language);
      gettextCatalog.setCurrentLanguage(self.language);
    }

    self.getMarketInfo = function(symbol) {
      changerService.getMarketInfo(symbol, "ark_ARK").then(function(answer) {
        self.buycoin = answer;
      });

      changerService.getMarketInfo("ark_ARK", symbol).then(function(answer) {
        self.sellcoin = answer;
      });
    };

    self.getMarketInfo(self.selectedCoin);

    var setExchangBuyExpirationProgress = function(timestamp){
      
    }

    self.buy = function() {
      if (self.exchangeEmail) storageService.set("email", self.exchangeEmail);
      if (self.selectedCoin) storageService.set("selectedCoin", self.selectedCoin);
      changerService.getMarketInfo(self.selectedCoin, "ark_ARK", self.buyAmount / self.buycoin.rate).then(function(rate) {
        var amount = self.buyAmount / rate.rate;
        if (self.selectedCoin.split("_")[1] == "USD") {
          amount = parseFloat(amount.toFixed(2));
        }
        changerService.makeExchange(self.exchangeEmail, amount, self.selectedCoin, "ark_ARK", self.selected.address).then(function(resp) {
          timeService.getTimestamp().then(
            function(timestamp) {
              self.exchangeBuy = resp;
              self.exchangeBuy.expirationPeriod = self.exchangeBuy.expiration - timestamp / 1000;
              self.exchangeBuy.expirationProgress = 0;
              self.exchangeBuy.expirationDate = new Date(self.exchangeBuy.expiration * 1000);
              self.exchangeBuy.sendCurrency = self.selectedCoin.split("_")[1];
              self.exchangeBuy.receiveCurrency = "ARK";
              var progressbar = $interval(function() {
                if (!self.exchangeBuy) {
                  $interval.cancel(progressbar);
                } else {
                  self.exchangeBuy.expirationProgress = (100 - 100 * (self.exchangeBuy.expiration - timestamp / 1000) / self.exchangeBuy.expirationPeriod).toFixed(0);
                }
              }, 200);
              changerService.monitorExchange(resp).then(
                function(data) {
                  self.exchangeHistory = changerService.getHistory();
                },
                function(data) {
    
                },
                function(data) {
                  if (data.payee && self.exchangeBuy.payee != data.payee) {
                    self.exchangeBuy = data;
                    self.exchangeHistory = changer.getHistory();
                  } else {
                    self.exchangeBuy.monitor = data;
                  }
                }
              );
    
            }, function(error) {
              formatAndToastError(error, 10000);
              self.exchangeBuy = null;
            });
            }
          )
          
      });

    };

    self.sendBatch = function() {
      changerService.sendBatch(self.exchangeBuy, self.exchangeTransactionId).then(function(data) {
          self.exchangeBuy.batch_required = false;
          self.exchangeTransactionId = null;
        },
        function(error) {
          formatAndToastError(error, 10000);
        });
    }

    var completeExchangeSell = function(timestamp){
      self.exchangeTransaction = transaction
      self.exchangeSell = resp;
      self.exchangeSell.expirationPeriod = self.exchangeSell.expiration - timestamp / 1000;
      self.exchangeSell.expirationProgress = 0;
      self.exchangeSell.expirationDate = new Date(self.exchangeSell.expiration * 1000);
      self.exchangeSell.receiveCurrency = self.selectedCoin.split("_")[1];
      self.exchangeSell.sendCurrency = "ARK";
      var progressbar = $interval(function() {
        if (!self.exchangeSell) {
          $interval.cancel(progressbar);
        } else {
          self.exchangeSell.expirationProgress = (100 - 100 * (self.exchangeSell.expiration - timestamp / 1000) / self.exchangeSell.expirationPeriod).toFixed(0);
        }
      }, 200);

      self.exchangeSellTransaction = transaction;
      changerService.monitorExchange(resp).then(
        function(data) {
          self.exchangeHistory = changerService.getHistory();
        },
        function(data) {

        },
        function(data) {
          if (data.payee && self.exchangeSell.payee != data.payee) {
            self.exchangeSell = data;
            self.exchangeHistory = changer.getHistory();
          } else {
            self.exchangeSell.monitor = data;
          }
        }
      );
    }

    self.sell = function() {
      if (self.exchangeEmail) storageService.set("email", self.exchangeEmail);
      changerService.makeExchange(self.exchangeEmail, self.sellAmount, "ark_ARK", self.selectedCoin, self.recipientAddress).then(function(resp) {
        accountService.createTransaction(0, {
          fromAddress: self.selected.address,
          toAddress: resp.payee,
          amount: parseInt(resp.send_amount * 100000000),
          masterpassphrase: self.passphrase,
          secondpassphrase: self.secondpassphrase
        }).then(function(transaction) {
            console.log(transaction);

            timeService.getTimestamp().then(
              function(timestamp){
                completeExchangeSell(timestamp);
              },
              function(timestamp){
                completeExchangeSell(timestamp);
              }
            )
            
          },
          function(error) {
            formatAndToastError(error, 10000)
          });
        self.passphrase = null;
        self.secondpassphrase = null;

      }, function(error) {
        formatAndToastError(error, 10000)
        self.exchangeSell = null;
      });
    }

    self.refreshExchange = function(exchange) {
      changerService.refreshExchange(exchange).then(function(exchange) {
        self.exchangeHistory = changerService.getHistory();
      });

    }

    self.exchangeArkNow = function(transaction) {
      networkService.postTransaction(transaction).then(
        function(transaction) {
          self.exchangeSell.sentTransaction = transaction;
          $mdToast.show(
            $mdToast.simple()
            .textContent(gettextCatalog.getString('Transaction') + ' ' + transaction.id + ' ' + gettextCatalog.getString('sent with success!'))
            .hideDelay(5000)
          );
        },
        formatAndToastError
      );
    }

    self.cancelExchange = function() {
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
    }

    self.getCoins = function() {
      console.log();
      return changerService.getCoins();
    }

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
    };

    self.getAllAccounts = function() {
      var accounts = self.accounts;
      if (self.ledgerAccounts && self.ledgerAccounts.length) {
        accounts = accounts.concat(self.ledgerAccounts);
      }

      return accounts;
    };

    self.myAccounts = function() {
      return self.accounts.filter(function(account) {
        return !!account.virtual;
      }).sort(function(a, b) {
        return b.balance - a.balance;
      });
    };

    self.myAccountsBalance = function() {
      return (self.getAllAccounts().reduce(function(memo, acc) {
        return memo + parseInt(acc.balance || 0);
      }, 0) / 100000000).toFixed(2);
    }

    //(ul.myAccountsBalance()*(ul.connectedPeer.market.price[ul.currency.name] || 0)).toFixed(2)}}
    self.myAccountsCurrencyBalance = function() {
      var currencyName = self.currency.name;
      var price = self.connectedPeer.market ? self.connectedPeer.market.price[currencyName] : 0;
      var currencyBalance = self.myAccountsBalance() * price;
      var languageCode = self.language.replace('_', '-');
      var options = {
        style: 'currency',
        currency: currencyName,
        currencyDisplay: 'symbol'
      }

      currencyBalance = Number(currencyBalance).toLocaleString(languageCode, options);
      
      if (currencyName == "btc") currencyBalance = currencyBalance.replace("BTC", "Ƀ");

      return currencyBalance;
    }

    self.otherAccounts = function() {
      return self.accounts.filter(function(account) {
        return !account.virtual;
      }).sort(function(a, b) {
        return b.balance - a.balance;
      });
    }

    self.openMenu = function($mdMenuOpen, ev) {
      originatorEv = ev;
      $mdMenuOpen(ev);
    };

    self.changeCurrency = function() {
      if (self.currency == undefined) self.currency = currencies[0];
      storageService.set("currency", self.currency);
    };

    self.pickRandomPeer = function() {
      networkService.pickRandomPeer();
    };

    self.getDefaultValue = function(account) {
      var amount = account.balance;
      if (account.virtual) {
        for (var folder in account.virtual) {
          if (account.virtual[folder].amount) {
            amount = amount - account.virtual[folder].amount;
          }
        }
      }
      return amount;
    };

    self.saveFolder = function(account, folder) {
      accountService.setToFolder(account.address, folder, account.virtual.uservalue(folder)() * 100000000);
    }

    self.deleteFolder = function(account, foldername) {
      account.virtual = accountService.deleteFolder(account.address, foldername);
    }

    self.createFolder = function(account) {
      if (account.virtual) {
        var confirm = $mdDialog.prompt()
          .title(gettextCatalog.getString('Create Virtual Folder'))
          .textContent(gettextCatalog.getString('Please enter a folder name.'))
          .placeholder(gettextCatalog.getString('folder name'))
          .ariaLabel(gettextCatalog.getString('Folder Name'))
          .ok(gettextCatalog.getString('Add'))
          .cancel(gettextCatalog.getString('Cancel'));
        $mdDialog.show(confirm).then(function(foldername) {
          account.virtual = accountService.setToFolder(account.address, foldername, 0);
          $mdToast.show(
            $mdToast.simple()
            .textContent(gettextCatalog.getString('Virtual folder added!'))
            .hideDelay(3000)
          );
        });
      } else {
        var confirm = $mdDialog.prompt()
          .title(gettextCatalog.getString('Login'))
          .textContent(gettextCatalog.getString('Please enter this account passphrase to login.'))
          .placeholder(gettextCatalog.getString('passphrase'))
          .ariaLabel(gettextCatalog.getString('Passphrase'))
          .ok(gettextCatalog.getString('Login'))
          .cancel(gettextCatalog.getString('Cancel'));
        $mdDialog.show(confirm).then(function(passphrase) {
          accountService.createVirtual(passphrase).then(function(virtual) {
            account.virtual = virtual;
            $mdToast.show(
              $mdToast.simple()
              .textContent(gettextCatalog.getString('Succesfully Logged In!'))
              .hideDelay(3000)
            );
          }, function(err) {
            $mdToast.show(
              $mdToast.simple()
              .textContent(gettextCatalog.getString('Error when trying to login: ') + err)
              .hideDelay(3000)
            );
          });
        });
      }
    };

    function gotoAddress(address) {
      var currentaddress = address;
      accountService.fetchAccountAndForget(currentaddress).then(function(a) {
        self.selected = a;
        if (self.selected.delegates) {
          self.selected.selectedVotes = self.selected.delegates.slice(0);
        } else self.selected.selectedVotes = [];
        accountService
          .refreshAccount(self.selected)
          .then(function(account) {
            if (self.selected.address == currentaddress) {
              self.selected.balance = account.balance;
              self.selected.secondSignature = account.secondSignature;
              self.selected.cold = account.cold;
              self.selected.publicKey = account.publicKey;

              if (!self.selected.virtual) self.selected.virtual = account.virtual;
            }
          });
        accountService
          .getTransactions(currentaddress)
          .then(function(transactions) {
            if (self.selected.address == currentaddress) {
              if (!self.selected.transactions) {
                self.selected.transactions = transactions;
              } else {
                transactions = transactions.sort(function(a, b) {
                  return b.timestamp - a.timestamp;
                });

                var previousTx = self.selected.transactions
                self.selected.transactions = transactions;

                // if the previous tx was unconfirmed, rebroadcast and put it back at the top (for better UX)
                if (previousTx.length && !previousTx[0].confirmations && previousTx[0].id != transactions[0].id) {
                  networkService.broadcastTransaction(previousTx[0]);
                  self.selected.transactions.unshift(previousTx[0]);
                }
              }
            }
          });
        accountService
          .getVotedDelegates(self.selected.address)
          .then(function(delegates) {
            if (self.selected.address == currentaddress) {
              self.selected.delegates = delegates;
              self.selected.selectedVotes = delegates.slice(0);
            }
          });
        accountService
          .getDelegate(self.selected.publicKey)
          .then(function(delegate) {
            if (self.selected.address == currentaddress) {
              self.selected.delegate = delegate;
            }
          });
      });

    }


    function refreshCurrentAccount() {
      var myaccount = self.selected;
      accountService
        .refreshAccount(myaccount)
        .then(function(account) {
          if (self.selected.address == myaccount.address) {
            self.selected.balance = account.balance;
            self.selected.secondSignature = account.secondSignature;
            self.selected.cold = account.cold;
            if(!self.selected.publicKey) self.selected.publicKey = account.publicKey;

            if (!self.selected.virtual) self.selected.virtual = account.virtual;
          }
        });
      accountService
        .getTransactions(myaccount.address)
        .then(function(transactions) {
          if (self.selected.address == myaccount.address) {
            if (!self.selected.transactions) {
              self.selected.transactions = transactions;
            } else {
              transactions = transactions.sort(function(a, b) {
                return b.timestamp - a.timestamp;
              });

              var previousTx = self.selected.transactions;
              self.selected.transactions = transactions;

              var playSound = storageService.get('playFundsReceivedSound');
              if (playSound == true && transactions.length > previousTx.length && transactions[0].type == 0 && transactions[0].recipientId == myaccount.address) {
                var wavFile = require('path').resolve(__dirname, 'assets/audio/power-up.wav');
                var audio = new Audio(wavFile);
                audio.play();
              }

              // if the previous tx was unconfirmed, put it back at the top (for better UX)
              if (previousTx.length && !previousTx[0].confirmations && previousTx[0].id != transactions[0].id) {
                networkService.broadcastTransaction(previousTx[0]);
                self.selected.transactions.unshift(previousTx[0]);
              }
            }
          }
        });
    }

    self.refreshAccountBalances = function() {
      networkService.getPrice();
      var accounts = self.getAllAccounts();
      for (var i in accounts) {
        accountService
          .refreshAccount(accounts[i])
          .then(function(account) {
            for (var j in accounts) {
              if (accounts[j].address == account.address) {
                accounts[j].balance = account.balance;
              }
            }
          });
      }
    }

    function togglePlayFundsReceivedSound(status) {
      storageService.set('playFundsReceivedSound', self.playFundsReceivedSound, true);
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectAccount(account) {
      var currentaddress = account.address;
      self.selected = accountService.getAccount(currentaddress);
      self.selected.ledger = account.ledger;

      pluginLoader.triggerEvent("onSelectAccount", self.selected);

      self.showPublicKey = false;

      loadSignedMessages();
      if (!self.selected.selectedVotes) {
        if (self.selected.delegates) {
          self.selected.selectedVotes = self.selected.delegates.slice(0);
        } else self.selected.selectedVotes = [];
      }
      accountService
        .refreshAccount(self.selected)
        .then(function(account) {
          if (self.selected.address == currentaddress) {
            self.selected.balance = account.balance;
            self.selected.secondSignature = account.secondSignature;
            self.selected.cold = account.cold;
            if(!self.selected.publicKey) self.selected.publicKey = account.publicKey;

            if (!self.selected.virtual) self.selected.virtual = account.virtual;
          }
        });
      accountService
        .getTransactions(currentaddress)
        .then(function(transactions) {
          if (self.selected.address == currentaddress) {
            if (!self.selected.transactions) {
              self.selected.transactions = transactions;
            } else {
              transactions = transactions.sort(function(a, b) {
                return b.timestamp - a.timestamp;
              });

              var previousTx = self.selected.transactions;
              self.selected.transactions = transactions;

              var playSound = storageService.get('playFundsReceivedSound');
              if (playSound == true && transactions.length > previousTx.length && transactions[0].type == 0 && transactions[0].recipientId == myaccount.address) {
                var wavFile = require('path').resolve(__dirname, 'assets/audio/power-up.wav');
                var audio = new Audio(wavFile);
                audio.play();
              }

              // if the previous tx was unconfirmed, but it back at the top (for better UX)
              if (previousTx.length && !previousTx[0].confirmations && previousTx[0].id != transactions[0].id) {
                networkService.broadcastTransaction(previousTx[0]);
                self.selected.transactions.unshift(previousTx[0]);
              }
            }
          }
        });
      accountService
        .getVotedDelegates(self.selected.address)
        .then(function(delegates) {
          if (self.selected.address == currentaddress) {
            self.selected.delegates = delegates;
            self.selected.selectedVotes = delegates.slice(0);
          }
        });
      accountService
        .getDelegate(self.selected.publicKey)
        .then(function(delegate) {
          if (self.selected.address == currentaddress) {
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
      };

      function validateAddress() {
        var isAddress = /^[1-9A-Za-z]+$/g;
        var address = $scope.address;
        if (isAddress.test(address)) {
          accountService.fetchAccount(address).then(function(account) {
            self.accounts.push(account);
            selectAccount(account);
            $mdToast.show(
              $mdToast.simple()
              .textContent(gettextCatalog.getString('Account added!'))
              .hideDelay(3000)
            );
          });
          cancel();
        } else {
          $mdToast.show(
            $mdToast.simple()
            .textContent(gettextCatalog.getString('Address') + " " + address + " " + gettextCatalog.getString('is not recognised'))
            .hideDelay(3000)
          );
        }

      };

      $scope.send = {
        cancel: cancel,
        validateAddress: validateAddress
      };
      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/addWatchOnlyAddress.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      });
    };

    function getAllDelegates(selectedAccount) {
      function arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
          for (var j = i + 1; j < a.length; ++j) {
            if (a[i] && a[i].username === a[j].username)
              a.splice(j--, 1);
          }
        }
        return a;
      }
      if (selectedAccount.selectedVotes) {
        return arrayUnique(selectedAccount.selectedVotes.concat(selectedAccount.delegates))
      } else return selectedAccount.delegates;
    };

    function addDelegate(selectedAccount) {
      var data = { fromAddress: selectedAccount.address, delegates: [], registeredDelegates: {} };
      accountService.getActiveDelegates().then(function(r) { data.registeredDelegates = r; });

      function add() {
        function indexOfDelegates(array, item) {
          for (var i in array) {
            if (array[i].username == item.username) {
              console.log(array[i]);
              return i;
            }
          }
          return -1;
        };
        $mdDialog.hide();
        accountService.getDelegateByUsername(data.delegatename).then(
          function(delegate) {
            if (self.selected.selectedVotes.length < 101 && indexOfDelegates(selectedAccount.selectedVotes, delegate) < 0) {
              selectedAccount.selectedVotes.push(delegate);
            } else {
              $mdToast.show(
                $mdToast.simple()
                .textContent(gettextCatalog.getString('List full or delegate already voted.'))
                .hideDelay(5000)
              );
            }
          },
          formatAndToastError
        );
      };

      function addSponsors() {
        function indexOfDelegates(array, item) {
          for (var i in array) {
            if (array[i].username == item.username) {
              console.log(array[i]);
              return i;
            }
          }
          return -1;
        };
        $mdDialog.hide();
        accountService.getSponsors().then(
          function(sponsors) {
            //check if sponsors are already voted
            if (self.selected.delegates) {
              newsponsors = [];
              for (var i = 0; i < sponsors.length; i++) {
                console.log(sponsors[i]);
                if (indexOfDelegates(self.selected.delegates, sponsors[i]) < 0) {
                  newsponsors.push(sponsors[i]);
                }
              }
              sponsors = newsponsors;
            }

            for (var i = 0; i < sponsors.length; i++) {
              if (self.selected.selectedVotes.length < 101 && indexOfDelegates(selectedAccount.selectedVotes, sponsors[i]) < 0) {
                selectedAccount.selectedVotes.push(sponsors[i]);
              }
            }
          },
          formatAndToastError
        );
      };


      function cancel() {
        $mdDialog.hide();
      };

      $scope.addDelegateDialog = {
        data: data,
        cancel: cancel,
        add: add,
        addSponsors: addSponsors
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/addDelegate.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    function vote(selectedAccount) {
      var votes = accountService.createDiffVote(selectedAccount.address, selectedAccount.selectedVotes);
      if (!votes || votes.length == 0) {
        $mdToast.show(
          $mdToast.simple()
          .textContent(gettextCatalog.getString('No difference from original delegate list'))
          .hideDelay(5000)
        );
        return;
      }
      votes = votes[0];
      var passphrases = accountService.getPassphrases(selectedAccount.address);
      var data = {
        ledger: selectedAccount.ledger,
        fromAddress: selectedAccount ? selectedAccount.address : '',
        secondSignature: selectedAccount ? selectedAccount.secondSignature : '',
        passphrase: passphrases[0] ? passphrases[0] : '',
        secondpassphrase: passphrases[1] ? passphrases[1] : '',
        votes: votes
      };

      function next() {
        $mdDialog.hide();
        var publicKeys = $scope.voteDialog.data.votes.map(function(delegate) {
          return delegate.vote + delegate.publicKey;
        }).join(",");
        console.log(publicKeys);
        accountService.createTransaction(3, {
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          fromAddress: $scope.voteDialog.data.fromAddress,
          publicKeys: publicKeys,
          masterpassphrase: $scope.voteDialog.data.passphrase,
          secondpassphrase: $scope.voteDialog.data.secondpassphrase
        }).then(
          function(transaction) {
            validateTransaction(selectedAccount, transaction);
          },
          formatAndToastError
        );
      };


      function cancel() {
        $mdDialog.hide();
      };

      $scope.voteDialog = {
        data: data,
        cancel: cancel,
        next: next
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/vote.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    function timestamp(selectedAccount) {
      var passphrases = accountService.getPassphrases(selectedAccount.address);
      var data = {
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
        var smartbridge = $scope.send.data.smartbridge;
        accountService.createTransaction(0, {
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          fromAddress: $scope.send.data.fromAddress,
          toAddress: $scope.send.data.fromAddress,
          amount: 1,
          smartbridge: smartbridge,
          masterpassphrase: $scope.send.data.passphrase,
          secondpassphrase: $scope.send.data.secondpassphrase
        }).then(
          function(transaction) {
            validateTransaction(selectedAccount, transaction);
          },
          formatAndToastError
        );
      };

      function openFile() {
        var crypto = require('crypto');
        var fs = require('fs');

        require('electron').remote.dialog.showOpenDialog(function(fileNames) {
          if (fileNames === undefined) return;
          var fileName = fileNames[0];
          var algo = 'sha256';
          var shasum = crypto.createHash(algo);
          $scope.send.data.filename = fileName;
          $scope.send.data.smartbridge = "Calculating signature....";
          var s = fs.ReadStream(fileName);

          s.on('data', function(d) { shasum.update(d); });
          s.on('end', function() {
            var d = shasum.digest('hex');
            $scope.send.data.smartbridge = d;
          });
        });
      };

      function cancel() {
        $mdDialog.hide();
      };

      $scope.send = {
        data: data,
        openFile: openFile,
        cancel: cancel,
        next: next
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/timestampDocument.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    function sendArk(selectedAccount) {
      var passphrases = accountService.getPassphrases(selectedAccount.address);
      var data = {
        ledger: selectedAccount.ledger,
        fromAddress: selectedAccount ? selectedAccount.address : '',
        secondSignature: selectedAccount ? selectedAccount.secondSignature : '',
        passphrase: passphrases[0] ? passphrases[0] : '',
        secondpassphrase: passphrases[1] ? passphrases[1] : '',
      };

      function openFile() {
        var fs = require('fs');

        require('electron').remote.dialog.showOpenDialog(function(fileNames) {
          if (fileNames === undefined) return;
          var fileName = fileNames[0];

          fs.readFile(fileName, 'utf8', function(err, data) {
            if (err) {
              formatAndToastError('Unable to load file' + ': ' + err);
            } else {
              try {
                var transaction = JSON.parse(data);

                if (transaction.type === undefined) return formatAndToastError('Invalid transaction file');
                validateTransaction(selectedAccount, transaction);

              } catch (ex) {
                formatAndToastError('Invalid file format');
              }
            }
          });
        });
      };

      // testing goodies
      // var data={
      //   fromAddress: selectedAccount ? selectedAccount.address: '',
      //   secondSignature: selectedAccount ? selectedAccount.secondSignature: '',
      //   passphrase: 'insect core ritual alcohol clinic opera aisle dial entire dust symbol vintage',
      //   secondpassphrase: passphrases[1] ? passphrases[1] : '',
      //   toAddress: 'AYxKh6vwACWicSGJATGE3rBreFK7whc7YA',
      //   amount: 1,
      // };
      var totalBalance = function(minusFee) {
        var fee = 10000000;
        var balance = selectedAccount.balance;
        return accountService.numberToFixed((minusFee ? balance - fee : balance) / 100000000);
      };

      function fillSendableBalance() {
        var sendableBalance = totalBalance(true);
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
        accountService.createTransaction(0, {
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          fromAddress: $scope.send.data.fromAddress,
          toAddress: $scope.send.data.toAddress,
          amount: parseInt($scope.send.data.amount * 100000000),
          smartbridge: $scope.send.data.smartbridge,
          masterpassphrase: $scope.send.data.passphrase,
          secondpassphrase: $scope.send.data.secondpassphrase
        }).then(
          function(transaction) {
            console.log(transaction);
            validateTransaction(selectedAccount, transaction);
          },
          formatAndToastError
        );
      };

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
        var contacts = storageService.get("contacts");
        if (!contacts) {
          return [];
        }
        var filter = contacts.filter(function(account) {
          return (account.address.toLowerCase().indexOf(text) > -1) || (account.name && (account.name.toLowerCase().indexOf(text) > -1));
        });
        return filter;
      }

      function cancel() {
        $mdDialog.hide();
      };

      function checkContacts(input) {
        if (input[0] != "@") return;
      };

      $scope.send = {
        openFile: openFile,
        data: data,
        cancel: cancel,
        next: next,
        checkContacts: checkContacts,
        searchTextChange: searchTextChange,
        selectedContactChange: selectedContactChange,
        querySearch: querySearch,
        fillSendableBalance: fillSendableBalance,
        totalBalance: totalBalance(false),
        remainingBalance: totalBalance(false), // <-- initial value, this will change by directive
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/sendArk.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    function sortObj(obj) {
      return Object.keys(obj).sort(function(a, b) {
        return obj[a] - obj[b];
      });
    }

    function generateDarkTheme(themeName) {
      var theme = themeName ? themeName : self.network.theme;
      var properties = $mdTheming.$get().THEMES[theme];

      var colors = properties.colors;
      var primary = colors.primary.name;
      var accent = colors.accent.name;
      var warn = colors.warn.name;
      var background = colors.background.name;

      $mdTheming.theme('dark').primaryPalette(primary).accentPalette(accent).warnPalette(warn).backgroundPalette(background).dark();
      $mdTheming.$get().generateTheme('dark');
    }

    // Compare vibrant colors from image with default material palette
    // And returns the most similar primary and accent palette
    function generateDynamicPalette(callback) {
      if (!self.network.background) {
        callback(false);
        return;
      }

      var path = require('path');
      var vibrant = require('node-vibrant');
      var materialPalette = $mdTheming.$get().PALETTES;

      // check if it's an image url
      var regExp = /\(([^)]+)\)/;
      var match = self.network.background.match(regExp);

      if (!match) {
        callback(false);
        return;
      }

      var url = path.resolve(__dirname, match[1].replace(/'/g, ''));

      vibrant.from(url).getPalette(function(err, palette) {
        if (err || !palette.Vibrant) {
          callback(false);
          return;
        }

        var vibrantRatio = {};
        var darkVibrantRatio = {};

        Object.keys(materialPalette).forEach(function(color) {
          var vibrantDiff = vibrant.Util.hexDiff(materialPalette[color]['900']['hex'], palette.Vibrant.getHex());
          vibrantRatio[color] = vibrantDiff;

          var darkVibrantDiff = vibrant.Util.hexDiff(materialPalette[color]['900']['hex'], palette.DarkVibrant.getHex());
          darkVibrantRatio[color] = darkVibrantDiff;
        });

        var isArkJpg = path.basename(url) === 'Ark.jpg';
        var primaryColor = isArkJpg ? 'red' : sortObj(darkVibrantRatio)[0];
        var accentColor = sortObj(vibrantRatio)[0];

        primaryColor = primaryColor == 'grey' ? 'blue-grey' : primaryColor;

        if (accentColor == 'grey' || accentColor == primaryColor) {
          accentColor = sortObj(vibrantRatio)[1];
        }

        var theme = $mdTheming.theme('dynamic').primaryPalette(primaryColor).accentPalette(accentColor);
        $mdTheming.$get().generateTheme('dynamic');

        callback('dynamic');

      });
    }

    function manageBackgrounds() {
      var fs = require('fs');
      var path = require('path');
      var context = storageService.getContext();

      var currentNetwork = networkService.getNetwork();

      var initialBackground = currentNetwork.background;
      var initialTheme = currentNetwork.theme;

      var currentTheme = self.currentTheme;
      var initialThemeView = currentTheme;
      var initialDarkMode = currentNetwork.themeDark;

      var themes = reloadThemes();
      delete themes['dark'];

      var backgrounds = {
        colors: {
          'Midnight': '#2c3e50',
          'Asbestos': '#7f8c8d',
          'Wisteria': '#674172',
          'Belize Hole': '#2980b9'
        },
        textures: {},
        images: {}
      };

      var imgPath = 'assets/images';
      var assetsPath = path.resolve(__dirname, imgPath);

      // find files in directory with same key
      for (var folder in backgrounds) {
        var fullPath = path.resolve(assetsPath, folder);

        if (fs.existsSync(path.resolve(fullPath))) { // check dir exists
          var image = {};
          fs.readdirSync(fullPath).forEach(function(file) {
            var stat = fs.statSync(path.join(fullPath, file)); // to prevent if directory

            if (stat.isFile()) {
              var url = path.join(imgPath, folder, file); // ex: assets/images/textures/file.png
              url = url.replace(/\\/g, "/");
              var name = path.parse(file).name; // remove extension
              image[name] = `url('${url}')`;
            }
          });
          backgrounds[folder] = image;
        }
      };

      function selectTheme(theme) {
        generateDarkTheme(theme);
        $scope.send.selectedTheme = theme;
        currentNetwork.theme = theme;
        currentNetwork.themeDark
        setDarkMode();
      }

      function selectBackground(background) {
        $scope.send.selectedBackground = background;
        currentNetwork.background = background;
      }

      function save() {
        $mdDialog.hide();
        networkService.setNetwork(context, currentNetwork);
        window.location.reload();
      };

      function cancel() {
        $mdDialog.hide();
        currentNetwork.background = initialBackground;
        currentNetwork.theme = initialTheme;
        currentNetwork.themeDark = initialDarkMode;
        currentTheme = initialThemeView;
      };

      function toggleDark(status) {
        currentNetwork.themeDark = status;
        setDarkMode();
      }

      function setDarkMode() {
        if (currentNetwork.themeDark) {
          self.currentTheme = 'dark';
        } else {
          self.currentTheme = currentNetwork.theme;
        }
      }

      $scope.send = {
        cancel: cancel,
        save: save,
        backgroundKeys: Object.keys(backgrounds),
        backgrounds: backgrounds,
        selectTheme: selectTheme,
        selectedTheme: initialTheme,
        themes: themes,
        selectBackground: selectBackground,
        selectedBackground: initialBackground,
        darkMode: initialDarkMode,
        toggleDark: toggleDark,
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/manageBackground.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      });
    };

    function manageNetworks() {
      var networks = networkService.getNetworks();


      function save() {
        //these are not needed as the createNetwork now rerender automatically
        $mdDialog.hide();
        for (var network in $scope.send.networks) {
          networkService.setNetwork(network, $scope.send.networks[network]);
          self.listNetworks = networkService.getNetworks();
        }
        //window.location.reload();
      };

      function cancel() {
        $mdDialog.hide();
      };

      function refreshTabs() {
        //reload networks
        networks = networkService.getNetworks();
        self.listNetworks = networks;
        //add it back to the scope
        $scope.send.networkKeys = Object.keys(networks);
        $scope.send.networks = networks;
        //tell angular that the list changed
        $scope.$apply();
      }

      function createNetwork() {
        networkService.createNetwork($scope.send.createnetwork).then(
          function(network) {
            refreshTabs();
          },
          formatAndToastError
        );
      };

      function removeNetwork(network) {
        var confirm = $mdDialog.confirm()
          .title(gettextCatalog.getString('Remove Network') + ' ' + network)
          .textContent(gettextCatalog.getString('Are you sure you want to remove this network and all data (accounts and settings) associated with it from your computer. Your accounts are still safe on the blockchain.'))
          .ok(gettextCatalog.getString('Remove from my computer all cached data from this network'))
          .cancel(gettextCatalog.getString('Cancel'));
        $mdDialog.show(confirm).then(function() {
          networkService.removeNetwork(network);
          self.listNetworks = networkService.getNetworks();
          $mdToast.show(
            $mdToast.simple()
            .textContent(gettextCatalog.getString('Network removed succesfully!'))
            .hideDelay(3000)
          );
        });

      }

      $scope.send = {
        networkKeys: Object.keys(networks),
        networks: networks,
        createNetwork: createNetwork,
        removeNetwork: removeNetwork,
        cancel: cancel,
        save: save
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/manageNetwork.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      });
    };

    function openPassphrasesDialog(selectedAccount) {
      var passphrases = accountService.getPassphrases(selectedAccount.address);
      var data = { address: selectedAccount.address, passphrase: passphrases[0], secondpassphrase: passphrases[1] };

      function save() {
        $mdDialog.hide();
        accountService.savePassphrases($scope.send.data.address, $scope.send.data.passphrase, $scope.send.data.secondpassphrase).then(
          function(account) {
            $mdToast.show(
              $mdToast.simple()
              .textContent(gettextCatalog.getString('Passphrases saved'))
              .hideDelay(5000)
            );
          },
          formatAndToastError
        );
      };


      function cancel() {
        $mdDialog.hide();
      };

      $scope.send = {
        data: data,
        cancel: cancel,
        save: save
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/savePassphrases.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    //register as delegate
    function createDelegate(selectedAccount) {
      var passphrases = accountService.getPassphrases(selectedAccount.address);
      var data = {
        ledger: selectedAccount.ledger,
        fromAddress: selectedAccount.address,
        username: "",
        secondSignature: selectedAccount.secondSignature,
        passphrase: passphrases[0] ? passphrases[0] : '',
        secondpassphrase: passphrases[1] ? passphrases[1] : ''
      };

      function next() {
        $mdDialog.hide();

        var delegateName;
        try {
          delegateName = accountService.sanitizeDelegateName($scope.createDelegate.data.username)
        } catch (error) {
          return formatAndToastError(error)
        }

        accountService.createTransaction(2, {
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          fromAddress: $scope.createDelegate.data.fromAddress,
          username: delegateName,
          masterpassphrase: $scope.createDelegate.data.passphrase,
          secondpassphrase: $scope.createDelegate.data.secondpassphrase
        }).then(
          function(transaction) {
            validateTransaction(selectedAccount, transaction);
          },
          formatAndToastError
        );
      };

      function cancel() {
        $mdDialog.hide();
      };

      $scope.createDelegate = {
        data: data,
        cancel: cancel,
        next: next
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/createDelegate.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    //Create a new cold account
    function createAccount() {
      var bip39 = require("bip39");
      var data = { passphrase: bip39.generateMnemonic() };

      function next() {
        if (!$scope.createAccountDialog.data.showRepassphrase) {
          $scope.createAccountDialog.data.repassphrase = $scope.createAccountDialog.data.passphrase;
          $scope.createAccountDialog.data.passphrase = "";
          $scope.createAccountDialog.data.showRepassphrase = true;
        } else {

          if (!$scope.createAccountForm.$valid) {
            return;
          }

          var words = $scope.createAccountDialog.data.repassphrase.split(' ');
          if ($scope.createAccountDialog.data.word3 === words[2] && $scope.createAccountDialog.data.word6 === words[5] && $scope.createAccountDialog.data.word9 === words[8]) {
            accountService.createAccount($scope.createAccountDialog.data.repassphrase).then(function(account) {
              self.accounts.push(account);
              $mdToast.show(
                $mdToast.simple()
                .textContent(gettextCatalog.getString('Account successfully created: ') + account.address)
                .hideDelay(5000)
              );
              selectAccount(account);
            });
            $mdDialog.hide();
          } else {
            $scope.createAccountDialog.data.showWrongRepassphrase = true;
          }
        }
      };

      function querySearch(text) {
        text = text.toLowerCase();
        var filter = self.accounts.filter(function(account) {
          return (account.address.toLowerCase().indexOf(text) > -1) || (account.username && (account.username.toLowerCase().indexOf(text) > -1));
        });
        return filter;
      }

      function cancel() {
        $mdDialog.hide();
      };

      $scope.createAccountDialog = {
        data: data,
        cancel: cancel,
        next: next
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/createAccount.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    function importAccount() {
      var data = {
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
            function(account) {
              // Check for already imported account
              for (var i = 0; i < self.accounts.length; i++) {
                if (self.accounts[i].address === account.address) {
                  $mdToast.show(
                    $mdToast.simple()
                    .textContent(gettextCatalog.getString('Account was already imported: ') + account.address)
                    .hideDelay(5000)
                  );
                  return selectAccount(account);
                }
              }

              self.accounts.push(account);
              $mdToast.show(
                $mdToast.simple()
                .textContent(gettextCatalog.getString('Account successfully imported: ') + account.address)
                .hideDelay(5000)
              );
              selectAccount(account);
              // TODO save passphrases after we have local encrytion
            },
            formatAndToastError
          );
        $mdDialog.hide();
      };

      function cancel() {
        $mdDialog.hide();
      };

      $scope.send = {
        data: data,
        cancel: cancel,
        save: save
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/importAccount.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };
    function exportAccount(account)
    {
      var eol = require('os').EOL;
      var filecontent = "Account:,"+account.address+eol+"Balance:,"+account.balance+eol+"Transactions:"+eol+"ID,Confirmations,Date,Type,Amount,From,To,Smartbridge"+eol
      account.transactions.forEach(function(trns) {
        filecontent = filecontent+trns.id+","+trns.confirmations+","+trns.date.toISOString()+","+trns.label+","+trns.humanTotal+","+trns.senderId+","+trns.recipientId+
        ","+trns.vendorField+eol;
      });
      var blob = new Blob([filecontent]);
      var downloadLink = document.createElement('a');
      downloadLink.setAttribute('download', account.address+'.csv');
      downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
      downloadLink.click();
    }

    // Add a second passphrase to an account
    function createSecondPassphrase(selectedAccount) {
      var bip39 = require("bip39");
      var data = { secondPassphrase: bip39.generateMnemonic() };

      if (selectedAccount.secondSignature) {
        return formatAndToastError(
          gettextCatalog.getString('This account already has a second passphrase: ' + selectedAccount.address)
        );
      }

      function next() {
        if (!$scope.createSecondPassphraseDialog.data.showRepassphrase) {
          $scope.createSecondPassphraseDialog.data.reSecondPassphrase = $scope.createSecondPassphraseDialog.data.secondPassphrase;
          $scope.createSecondPassphraseDialog.data.secondPassphrase = "";
          $scope.createSecondPassphraseDialog.data.showRepassphrase = true;
        } else if ($scope.createSecondPassphraseDialog.data.reSecondPassphrase !== $scope.createSecondPassphraseDialog.data.secondPassphrase) {
          $scope.createSecondPassphraseDialog.data.showWrongRepassphrase = true;
        } else {
          accountService.createTransaction(1, {
            fromAddress: selectedAccount.address,
            masterpassphrase: $scope.createSecondPassphraseDialog.data.passphrase,
            secondpassphrase: $scope.createSecondPassphraseDialog.data.reSecondPassphrase
          }).then(
            function(transaction) {
              validateTransaction(selectedAccount, transaction);
            },
          formatAndToastError
        );
          $mdDialog.hide();
        }
      };

      function cancel() {
        $mdDialog.hide();
      };

      $scope.createSecondPassphraseDialog = {
        data: data,
        cancel: cancel,
        next: next
      };

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/createSecondPassphrase.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    /**
     * Show the Contact view in the bottom sheet
     */
    function showAccountMenu(selectedAccount) {

      var items = [
        { name: gettextCatalog.getString('Open in explorer'), icon: 'open_in_new' },
        { name: gettextCatalog.getString('Remove'), icon: 'clear' },
      ];

      if (!selectedAccount.delegate) {
        items.push({ name: gettextCatalog.getString('Label'), icon: 'local_offer' });
      }
      if (!selectedAccount.delegate && !selectedAccount.ledger) {
        items.push({ name: gettextCatalog.getString('Register Delegate'), icon: 'perm_identity' });
      }

      items.push({ name: gettextCatalog.getString('Timestamp Document'), icon: 'verified_user' });

      if (!selectedAccount.secondSignature && !selectedAccount.ledger ) {
        items.push({ name: gettextCatalog.getString('Second Passphrase'), icon: 'lock' });
      }
      function answer(action) {
        $mdBottomSheet.hide();

        if (action == gettextCatalog.getString('Open in explorer')) {
          openExplorer('/address/' + selectedAccount.address);
        }

        if (action == gettextCatalog.getString('Timestamp Document')) {
          timestamp(selectedAccount);
        } else if (action == gettextCatalog.getString("Remove")) {
          var confirm = $mdDialog.confirm()
            .title(gettextCatalog.getString('Remove Account') + ' ' + selectedAccount.address)
            .textContent(gettextCatalog.getString('Remove this account from your wallet. ' +
              'The account may be added again using the original passphrase of the account.'))
            .ok(gettextCatalog.getString('Remove account'))
            .cancel(gettextCatalog.getString('Cancel'));
          $mdDialog.show(confirm).then(function() {
            accountService.removeAccount(selectedAccount).then(function() {
              self.accounts = accountService.loadAllAccounts();

              if (self.accounts.length > 0) {
                selectAccount(self.accounts[0]);
              } else {
                self.selected = null
              }

              $mdToast.show(
                $mdToast.simple()
                .textContent(gettextCatalog.getString('Account removed!'))
                .hideDelay(3000)
              );
            });
          });
        } else if (action == gettextCatalog.getString("Send Ark")) {
          sendArk();
        } else if (action == gettextCatalog.getString("Register Delegate")) {
          createDelegate(selectedAccount);
        } else if (action == gettextCatalog.getString("Label")) {
          var prompt = $mdDialog.prompt()
            .title(gettextCatalog.getString('Label'))
            .textContent(gettextCatalog.getString('Please enter a short label.'))
            .placeholder(gettextCatalog.getString('label'))
            .ariaLabel(gettextCatalog.getString('Label'))
            .ok(gettextCatalog.getString('Set'))
            .cancel(gettextCatalog.getString('Cancel'));
          $mdDialog.show(prompt).then(function(label) {
            accountService.setUsername(selectedAccount.address, label);
            self.accounts = accountService.loadAllAccounts();
            $mdToast.show(
              $mdToast.simple()
              .textContent(gettextCatalog.getString('Label set'))
              .hideDelay(3000)
            );
          });
        } else if (action == gettextCatalog.getString("Second Passphrase")) {
          createSecondPassphrase(selectedAccount);
        }
      };

      $scope.bs = {
        address: selectedAccount.address,
        answer: answer,
        items: items
      };

      $mdBottomSheet.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/contactSheet.html',
        clickOutsideToClose: true,
        preserveScope: true,
        scope: $scope
      });

    }

    function loadSignedMessages() {
      self.selected.signedMessages = storageService.get("signed-" + self.selected.address);
    }

    self.deleteSignedMessage = function(selectedAccount, signedMessage) {
      var index = selectedAccount.signedMessages.indexOf(signedMessage);
      selectedAccount.signedMessages.splice(index, index + 1);
      storageService.set("signed-" + selectedAccount.address, selectedAccount.signedMessages);
    }

    function showMessage(message) {
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.getElementById('app')))
        .clickOutsideToClose(true)
        .title(message)
        .ariaLabel(message)
        .ok(gettextCatalog.getString('Ok'))
      );
    }

    self.signMessage = function(selectedAccount) {

      console.log(selectedAccount);

      function sign() {
        var address = $scope.sign.selectedAccount.address;
        var passphrase = $scope.sign.passphrase;
        var message = $scope.sign.message;
        if (!selectedAccount.signedMessages) {
          selectedAccount.signedMessages = [];
        }
        var promisedSignature = null
        if (selectedAccount.ledger) {
          promisedSignature = accountService.signMessageWithLedger(message, selectedAccount.ledger);
        } else {
          promisedSignature = accountService.signMessage(message, passphrase);
        }

        promisedSignature.then(
          function(result) {
            selectedAccount.signedMessages.push({
              publickey: selectedAccount.publicKey,
              signature: result.signature,
              message: message
            });
            storageService.set("signed-" + selectedAccount.address, selectedAccount.signedMessages);
            $mdDialog.hide();
          },
          function(error) {
            showMessage(error)
          }
        );
      };

      function cancel() {
        $mdDialog.hide();
      };

      var passphrases = accountService.getPassphrases(selectedAccount.address);

      $scope.sign = {
        passphrase: passphrases[0] ? passphrases[0] : '',
        sign: sign,
        cancel: cancel,
        selectedAccount: selectedAccount
      };

      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/signMessage.html',
        clickOutsideToClose: false
      });
    };

    self.verifyMessage = function(signedMessage) {

      function verify() {
        console.log($scope.verify);
        var message = $scope.verify.message;
        var publickey = $scope.verify.publickey;
        var signature = $scope.verify.signature;
        var result = accountService.verifyMessage(message, publickey, signature);
        $mdDialog.hide();
        showMessage(result);
      };

      function verifyText() {
        var list = JSON.parse($scope.verify.message);
        var res = accountService.verifyMessage(list["message"], list["publickey"], list["signature"]);
        var message = gettextCatalog.getString("Error in signature processing");
        
        $mdDialog.hide();
        if (res == true) {
          message = gettextCatalog.getString("The message is verified successfully");
        } else {
          message = gettextCatalog.getString("The message is NOT verified");
        }
        showMessage(message, res);
      };


      function cancel() {
        $mdDialog.hide();
      };

      if (signedMessage) {
        $scope.verify = signedMessage;
        verify();
      } else {
        $scope.verify = {
          verify: verify,
          verifyText: verifyText,
          cancel: cancel,
          publickey: self.selected.publicKey
        };

        $mdDialog.show({
          scope: $scope,
          preserveScope: true,
          parent: angular.element(document.getElementById('app')),
          templateUrl: './src/accounts/view/verifyMessage.html',
          clickOutsideToClose: false
        });
      }

    };

    function validateTransaction(selectedAccount, transaction) {

      function saveFile() {
        var fs = require('fs');
        var raw = JSON.stringify(transaction);

        require('electron').remote.dialog.showSaveDialog({
          defaultPath: transaction.id + '.json',
          filters: [{
            extensions: ['json']
          }]
        }, function(fileName) {
          if (fileName === undefined) return;

          fs.writeFile(fileName, raw, 'utf8', function(err) {
            if (err) {
              $mdToast.show(
                $mdToast.simple()
                .textContent(gettextCatalog.getString('Failed to save transaction file') + ': ' + err)
                .hideDelay(5000)
                .theme("error")
              );
            } else {
              $mdToast.show(
                $mdToast.simple()
                .textContent(gettextCatalog.getString('Transaction file successfully saved in') + ' ' + fileName)
                .hideDelay(5000)
              );
            }
          });
        });

      }

      function send() {
        $mdDialog.hide();

        transaction = accountService.formatTransaction(transaction, selectedAccount.address);
        transaction.confirmations = 0;

        networkService.postTransaction(transaction).then(
          function(transaction) {
            selectedAccount.transactions.unshift(transaction);
            $mdToast.show(
              $mdToast.simple()
              .textContent(gettextCatalog.getString('Transaction') + ' ' + transaction.id + ' ' + gettextCatalog.getString('sent with success!'))
              .hideDelay(5000)
            );
          },
          formatAndToastError
        );
      };

      function cancel() {
        $mdDialog.hide();
      };

      $scope.validate = {
        saveFile: saveFile,
        send: send,
        cancel: cancel,
        transaction: transaction,
        // to avoid small transaction to be displayed as 1e-8
        humanAmount: accountService.numberToFixed(transaction.amount / 100000000) + '',
      };

      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/showTransaction.html',
        clickOutsideToClose: false
      });
    };

  }

})();
