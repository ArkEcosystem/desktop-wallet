(function(){
  angular
       .module('arkclient')
       .controller('AccountController', [
          'accountService', 'networkService', 'storageService', 'changerService', '$mdToast', '$mdSidenav', '$mdBottomSheet', '$timeout', '$interval', '$log', '$mdDialog', '$scope', '$mdMedia', 'gettextCatalog',
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
        }
       ]).filter('smallId', function(accountService) {
          return function(fullId) {
            return accountService.smallId(fullId)
          }
        }).filter('exchangedate', [function() {
           return function(exchangetime) {
             return new Date(exchangetime*1000);
           };
         }
       ]).filter('exchangedate', [function() {
           return function(exchangetime) {
             return new Date(exchangetime*1000);
           };
         }
       ]).filter('amountToCurrency', [function() {
          return function(amount, scope) {
            if (typeof amount === 'undefined' || amount == 0) return 0;
            var price = scope.ul.connectedPeer.market.price[scope.ul.currency.name];
            return (amount * price).toFixed(5);
          }
       }]).directive('copyToClipboard',  function ($window, $mdToast) {
        var body = angular.element($window.document.body);
        var textarea = angular.element('<textarea/>');
        textarea.css({
            position: 'fixed',
            opacity: '0'
        });

        function copy(toCopy) {
            textarea.val(toCopy);
            body.append(textarea);
            textarea[0].select();

            try {
                var successful = document.execCommand('copy');
                if (!successful) throw successful;
            } catch (err) {
                console.log("failed to copy", toCopy);
            }
            $mdToast.simple()
              .textContent('Text copied to clipboard!')
              .hideDelay(2000);
            textarea.remove();
        }

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function (e) {
                    copy(attrs.copyToClipboard);
                });
            }
        }
      });
  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function AccountController( accountService, networkService, storageService, changerService, $mdToast, $mdSidenav, $mdBottomSheet, $timeout, $interval, $log, $mdDialog, $scope, $mdMedia, gettextCatalog) {

    var self = this;

    var languages = {
      en:gettextCatalog.getString("English"),
      zh_CN:gettextCatalog.getString("Chinese simplified"),
      zh_TW:gettextCatalog.getString("Chinese traditional"),
      fr:gettextCatalog.getString("French"),
      el:gettextCatalog.getString("Greek"),
      nl:gettextCatalog.getString("Dutch"),
      ar:gettextCatalog.getString("Arab"),
      pl:gettextCatalog.getString("Polish"),
      pt_BR:gettextCatalog.getString("Portuguese"),
      bg_BG:gettextCatalog.getString("Bulgarian"),
      hu:gettextCatalog.getString("Hungarish"),
      sl:gettextCatalog.getString("Slovenian"),
      ro:gettextCatalog.getString("Romanian"),
      de:gettextCatalog.getString("German"),
      it:gettextCatalog.getString("Italian"),
      id:gettextCatalog.getString("Indonesian"),
      ru:gettextCatalog.getString("Russian")
    };


    gettextCatalog.debug = false;
    self.language  = storageService.get("language");
    if(!self.language) selectNextLanguage();
    else gettextCatalog.setCurrentLanguage(self.language);

    self.getLanguage=function(){
      return languages[self.language];
    };


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
      return require('electron').remote.getCurrentWindow()[action](args);
    };

    self.openExternal = function(url){
      require('electron').shell.openExternal(url);
    };

    self.openExplorer = openExplorer;
    self.clientVersion = require('../../package.json').version;
    self.latestClientVersion = self.clientVersion;
    networkService.getLatestClientVersion().then( function(r) { self.latestClientVersion = r; } );
    self.isNetworkConnected=false;
    self.selected     = null;
    self.accounts        = [ ];
    self.selectAccount   = selectAccount;
    self.refreshCurrentAccount   = refreshCurrentAccount;
    self.gotoAddress = gotoAddress;
    self.getAllDelegates = getAllDelegates;
    self.addWatchOnlyAddress   = addWatchOnlyAddress;
    self.createAccount = createAccount;
    self.importAccount = importAccount;
    self.toggleList   = toggleAccountsList;
    self.sendArk  = sendArk;
    self.createSecondPassphrase  = createSecondPassphrase;
    self.copiedToClipboard  = copiedToClipboard;

    self.playFundsReceivedSong = storageService.get("playFundsReceivedSong") || false;
    self.togglePlayFundsReceivedSong = togglePlayFundsReceivedSong;
    self.manageBackgrounds  = manageBackgrounds;
    self.manageNetworks  = manageNetworks;
    self.openPassphrasesDialog  = openPassphrasesDialog;
    self.createDelegate = createDelegate;
    self.vote  = vote;
    self.addDelegate = addDelegate;
    self.showAccountMenu  = showAccountMenu;
    self.selectNextLanguage = selectNextLanguage;
    self.currency = storageService.get("currency") || {name:"btc",symbol:"Ƀ"};
    self.switchNetwork = networkService.switchNetwork;
    self.network = networkService.getNetwork();
    self.marketinfo= {};
    self.exchangeHistory=changerService.getHistory();
    self.selectedCoin=storageService.get("selectedCoin") || "bitcoin_BTC";
    self.exchangeEmail=storageService.get("email") || "";

    self.connectedPeer={isConnected:false};

    //refreshing displayed account every 8s
    setInterval(function(){
      if(self.selected){
        self.refreshCurrentAccount();
      }
    }, 8*1000);

    self.connection = networkService.getConnection();

    self.connection.then(
      function(){},
      function(){},
      function(connectedPeer){
        self.connectedPeer=connectedPeer;
        if(!self.connectedPeer.isConnected && self.isNetworkConnected){
          self.isNetworkConnected=false;
          $mdToast.show(
            $mdToast.simple()
              .textContent(gettextCatalog.getString('Network disconnected!'))
              .hideDelay(10000)
          );
        }
        else if(self.connectedPeer.isConnected && !self.isNetworkConnected){
          self.isNetworkConnected=true;
          // trick to make it appear last.
          $timeout(function(){
            $mdToast.show(
              $mdToast.simple()
                .textContent(gettextCatalog.getString('Network connected and healthy!'))
                .hideDelay(10000)
            );
          },1000);

        }
      }
    );

    function openExplorer(uri){
      require('electron').shell.openExternal(self.network.explorer+uri);
    }

    function formatErrorMessage(error) {
      var basicMessage = '';
      if ('string' === typeof error){
        basicMessage = error;
      } else if ('string' === typeof error.error){
        basicMessage = error.error;
      } else if ('string' === typeof error.data){
        basicMessage = error.data;
      } else if ('string' === typeof error.message){
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

    function copiedToClipboard(){
      $mdToast.show(
        $mdToast.simple()
          .textContent(gettextCatalog.getString('Copied to clipboard'))
          .hideDelay(5000)
      );
    }

    function selectNextLanguage(){
      var lkeys=Object.keys(languages);
      if(self.language) self.language=lkeys[(lkeys.indexOf(self.language) + 1) % lkeys.length];
      else self.language = "en";
      storageService.set("language",self.language);
      gettextCatalog.setCurrentLanguage(self.language);
    }

    self.getMarketInfo=function(symbol){
      changerService.getMarketInfo(symbol,"ark_ARK").then(function(answer){
        self.buycoin=answer;
      });

      changerService.getMarketInfo("ark_ARK",symbol).then(function(answer){
        self.sellcoin=answer;
      });
    };

    self.getMarketInfo(self.selectedCoin);

    self.buy=function(){
      if(self.exchangeEmail) storageService.set("email",self.exchangeEmail);
      if(self.selectedCoin) storageService.set("selectedCoin",self.selectedCoin);
      changerService.getMarketInfo(self.selectedCoin,"ark_ARK",self.buyAmount/self.buycoin.rate).then(function(rate){
        var amount = self.buyAmount/rate.rate;
        if(self.selectedCoin.split("_")[1]=="USD"){
          amount=parseFloat(amount.toFixed(2));
        }
        changerService.makeExchange(self.exchangeEmail, amount, self.selectedCoin, "ark_ARK", self.selected.address).then(function(resp){
          self.exchangeBuy=resp;
          self.exchangeBuy.expirationPeriod=self.exchangeBuy.expiration-new Date().getTime()/1000;
          self.exchangeBuy.expirationProgress=0;
          self.exchangeBuy.expirationDate=new Date(self.exchangeBuy.expiration*1000);
          self.exchangeBuy.sendCurrency=self.selectedCoin.split("_")[1];
          self.exchangeBuy.receiveCurrency="ARK";
          var progressbar=$interval(function(){
            if(!self.exchangeBuy){
              $interval.cancel(progressbar);
            }
            else{
              self.exchangeBuy.expirationProgress=(100-100*(self.exchangeBuy.expiration-new Date().getTime()/1000)/self.exchangeBuy.expirationPeriod).toFixed(0);
            }
          },200);
          changerService.monitorExchange(resp).then(
            function(data){
              self.exchangeHistory=changerService.getHistory();
            },
            function(data){

            },
            function(data){
              if(data.payee && self.exchangeBuy.payee!=data.payee){
                self.exchangeBuy=data;
                self.exchangeHistory=changer.getHistory();
              }
              else{
                self.exchangeBuy.monitor=data;
              }
            }
          );

        },function(error){
          formatAndToastError(error, 10000);
          self.exchangeBuy=null;
        });
      });

    };

    self.sendBatch=function(){
      changerService.sendBatch(self.exchangeBuy,self.exchangeTransactionId).then(function(data){
        self.exchangeBuy.batch_required=false;
        self.exchangeTransactionId=null;
      },
      function(error){
        formatAndToastError(error, 10000);
      });
    }

    self.sell=function(){
      if(self.exchangeEmail) storageService.set("email",self.exchangeEmail);
      changerService.makeExchange(self.exchangeEmail, self.sellAmount, "ark_ARK", self.selectedCoin, self.recipientAddress).then(function(resp){
        accountService.createTransaction(0,
          {
            fromAddress: self.selected.address,
            toAddress: resp.payee,
            amount: parseInt(resp.send_amount*100000000),
            masterpassphrase: self.passphrase,
            secondpassphrase: self.secondpassphrase
          }
        ).then(function(transaction){
          console.log(transaction);
          self.exchangeTransaction=transaction
          self.exchangeSell=resp;
          self.exchangeSell.expirationPeriod=self.exchangeSell.expiration-new Date().getTime()/1000;
          self.exchangeSell.expirationProgress=0;
          self.exchangeSell.expirationDate=new Date(self.exchangeSell.expiration*1000);
          self.exchangeSell.receiveCurrency=self.selectedCoin.split("_")[1];
          self.exchangeSell.sendCurrency="ARK";
          var progressbar=$interval(function(){
            if(!self.exchangeSell){
              $interval.cancel(progressbar);
            }
            else{
              self.exchangeSell.expirationProgress=(100-100*(self.exchangeSell.expiration-new Date().getTime()/1000)/self.exchangeSell.expirationPeriod).toFixed(0);
            }
          },200);

          self.exchangeSellTransaction=transaction;
          changerService.monitorExchange(resp).then(
            function(data){
              self.exchangeHistory=changerService.getHistory();
            },
            function(data){

            },
            function(data){
              if(data.payee && self.exchangeSell.payee!=data.payee){
                self.exchangeSell=data;
                self.exchangeHistory=changer.getHistory();
              }
              else{
                self.exchangeSell.monitor=data;
              }
            }
          );
        },
        function(error){
          formatAndToastError(error, 10000)
        });
        self.passphrase=null;
        self.secondpassphrase=null;

      },function(error){
        formatAndToastError(error, 10000)
        self.exchangeSell=null;
      });
    }

    self.refreshExchange=function(exchange){
      changerService.refreshExchange(exchange).then(function(exchange){
        self.exchangeHistory=changerService.getHistory();
      });

    }

    self.exchangeArkNow=function(transaction){
      networkService.postTransaction(transaction).then(
        function(transaction){
          self.exchangeSell.sentTransaction=transaction;
          $mdToast.show(
            $mdToast.simple()
              .textContent(gettextCatalog.getString('Transaction')+ ' ' + transaction.id + ' ' +gettextCatalog.getString('sent with success!'))
              .hideDelay(5000)
          );
        },
        formatAndToastError
      );
    }

    self.cancelExchange=function(){
      if(self.exchangeBuy){
        changerService.cancelExchange(self.exchangeBuy);
        self.exchangeBuy=null;
        self.exchangeTransactionId=null;
      }
      if(self.exchangeSell){
        changerService.cancelExchange(self.exchangeSell);
        self.exchangeTransaction=null;
        self.exchangeSell=null;
      }
    }

    self.getCoins=function(){
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
      if($mdMedia('md')||$mdMedia('sm')) $mdSidenav('left').toggle();
    };

    self.myAccounts = function(){
      return self.accounts.filter(function(account){
        return !!account.virtual;
      }).sort(function(a,b){
        return b.balance-a.balance;
      });
    };

    self.myAccountsBalance = function(){
      return (self.myAccounts().reduce(function(memo,acc){
        return memo+parseInt(acc.balance);
      },0)/100000000).toFixed(2);
    }

    self.otherAccounts = function(){
      return self.accounts.filter(function(account){
        return !account.virtual;
      }).sort(function(a,b){
        return b.balance-a.balance;
      });
    }

    self.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };


    self.changeCurrency=function(){
      var currencies=[
        {name:"btc",symbol:"Ƀ"},
        {name:"usd",symbol:"$"},
        {name:"eur",symbol:"€"},
        {name:"cny",symbol:"CN¥"},
        {name:"cad",symbol:"Can$"},
        {name:"gbp",symbol:"£"},
        {name:"hkd",symbol:"HK$"},
        {name:"jpy",symbol:"JP¥"},
        {name:"rub",symbol:'\u20BD'},
        {name:"aud",symbol:"A$"}
      ];
      self.currency=currencies[currencies.map(function(x) {return x.name; }).indexOf(self.currency.name)+1];
      if(self.currency==undefined) self.currency=currencies[0];
      storageService.set("currency",self.currency);
    };

    self.pickRandomPeer=function(){
      networkService.pickRandomPeer();
    };

    self.getDefaultValue=function(account){
      var amount=account.balance;
      if(account.virtual){
        for (var folder in account.virtual) {
          if (account.virtual[folder].amount) {
            amount=amount-account.virtual[folder].amount;
          }
        }
      }
      return amount;
    };

    self.saveFolder=function(account,folder){
      accountService.setToFolder(account.address,folder,account.virtual.uservalue(folder)()*100000000);
    }

    self.deleteFolder=function(account, foldername){
      account.virtual=accountService.deleteFolder(account.address,foldername);
    }

    self.createFolder=function(account){
      if(account.virtual){
        var confirm = $mdDialog.prompt()
            .title(gettextCatalog.getString('Create Virtual Folder'))
            .textContent(gettextCatalog.getString('Please enter a folder name.'))
            .placeholder(gettextCatalog.getString('folder name'))
            .ariaLabel(gettextCatalog.getString('Folder Name'))
            .ok(gettextCatalog.getString('Add'))
            .cancel(gettextCatalog.getString('Cancel'));
        $mdDialog.show(confirm).then(function(foldername) {
          account.virtual=accountService.setToFolder(account.address,foldername,0);
          $mdToast.show(
            $mdToast.simple()
              .textContent(gettextCatalog.getString('Virtual folder added!'))
              .hideDelay(3000)
          );
        });
      }
      else{
        var confirm = $mdDialog.prompt()
            .title(gettextCatalog.getString('Login'))
            .textContent(gettextCatalog.getString('Please enter this account passphrase to login.'))
            .placeholder(gettextCatalog.getString('passphrase'))
            .ariaLabel(gettextCatalog.getString('Passphrase'))
            .ok(gettextCatalog.getString('Login'))
            .cancel(gettextCatalog.getString('Cancel'));
        $mdDialog.show(confirm).then(function(passphrase) {
          accountService.createVirtual(passphrase).then(function(virtual){
            account.virtual=virtual;
            $mdToast.show(
              $mdToast.simple()
                .textContent(gettextCatalog.getString('Succesfully Logged In!'))
                .hideDelay(3000)
            );
          }, function(err) {
            $mdToast.show(
              $mdToast.simple()
                .textContent(gettextCatalog.getString('Error when trying to login: ')+err)
                .hideDelay(3000)
            );
          });
        });
      }
    };

    function gotoAddress(address){
      var currentaddress=address;
      accountService.fetchAccountAndForget(currentaddress).then(function(a){
        self.selected=a;
        if(self.selected.delegates){
          self.selected.selectedVotes = self.selected.delegates.slice(0);
        }
        else self.selected.selectedVotes=[];
        accountService
          .refreshAccount(self.selected)
          .then(function(account){
            if(self.selected.address==currentaddress){
              self.selected.balance = account.balance;

              if(!self.selected.virtual) self.selected.virtual = account.virtual;
            }
          });
        accountService
          .getTransactions(currentaddress)
          .then(function(transactions){
            if(self.selected.address==currentaddress){
              if(!self.selected.transactions){
                self.selected.transactions = transactions;
              }
              else{
                transactions=transactions.sort(function(a,b){
                  return b.timestamp-a.timestamp;
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
          .then(function(delegates){
            if(self.selected.address==currentaddress){
              self.selected.delegates=delegates;
              self.selected.selectedVotes = delegates.slice(0);
            }
          });
        accountService
          .getDelegate(self.selected.publicKey)
          .then(function(delegate){
            if(self.selected.address==currentaddress){
              self.selected.delegate = delegate;
            }
          });
      });

    }


  function refreshCurrentAccount(){
    var myaccount=self.selected;
    accountService
      .refreshAccount(myaccount)
      .then(function(account){
        if(self.selected.address==myaccount.address){
          self.selected.balance = account.balance;
          if(!self.selected.virtual) self.selected.virtual = account.virtual;
        }
      });
    accountService
      .getTransactions(myaccount.address)
      .then(function(transactions){
        if(self.selected.address==myaccount.address){
          if(!self.selected.transactions){
            self.selected.transactions = transactions;
          }
          else{
            transactions=transactions.sort(function(a,b){
              return b.timestamp-a.timestamp;
            });

            var previousTx = self.selected.transactions
            self.selected.transactions = transactions;

            var playSong = storageService.get('playFundsReceivedSong');
            if (playSong == true && transactions.length > previousTx.length && transactions[0].type == 0 && transactions[0].recipientId == myaccount.address) {
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

     self.refreshAccountBalances = function(){
      for(var i in self.accounts){
        accountService
        .refreshAccount(self.accounts[i])
          .then(function(account){
            for(var j in self.accounts){
              if(self.accounts[j].address == account.address){
                self.accounts[j].balance = account.balance;
            }
          }
        });
      }
    }

    function togglePlayFundsReceivedSong(status) {
      storageService.set('playFundsReceivedSong', self.playFundsReceivedSong, true);
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectAccount (account) {
      var currentaddress=account.address;
      self.selected = accountService.getAccount(currentaddress);
      if(!self.selected.selectedVotes){
        if(self.selected.delegates){
          self.selected.selectedVotes = self.selected.delegates.slice(0);
        }
        else self.selected.selectedVotes=[];
      }
      accountService
        .refreshAccount(self.selected)
        .then(function(account){
          if(self.selected.address==currentaddress){
            self.selected.balance = account.balance;

            if(!self.selected.virtual) self.selected.virtual = account.virtual;
          }
        });
      accountService
        .getTransactions(currentaddress)
        .then(function(transactions){
          if(self.selected.address==currentaddress){
            if(!self.selected.transactions){
              self.selected.transactions = transactions;
            }
            else{
              transactions=transactions.sort(function(a,b){
                return b.timestamp-a.timestamp;
              });

              var previousTx = self.selected.transactions
              self.selected.transactions = transactions;

              var playSong = storageService.get('playFundsReceivedSong');
              if (playSong == true && transactions.length > previousTx.length && transactions[0].type == 0 && transactions[0].recipientId == myaccount.address) {
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
        .then(function(delegates){
          if(self.selected.address==currentaddress){
            self.selected.delegates=delegates;
            self.selected.selectedVotes = delegates.slice(0);
          }
        });
      accountService
        .getDelegate(self.selected.publicKey)
        .then(function(delegate){
          if(self.selected.address==currentaddress){
            self.selected.delegate = delegate;
          }
        });
    }

    /**
     * Add an account
     */
    function addWatchOnlyAddress(){
      
      function cancel() {
        $mdDialog.hide();
      };

      function validateAddress() {
        var isAddress = /^[1-9A-Za-z]+$/g;
        var address = $scope.address;
        if(isAddress.test(address)){
          accountService.fetchAccount(address).then(function(account){
            self.accounts.push(account);
            selectAccount(account);
            $mdToast.show(
              $mdToast.simple()
                .textContent(gettextCatalog.getString('Account added!'))
                .hideDelay(3000)
            );
          });
          cancel();
        }
        else{
          $mdToast.show(
            $mdToast.simple()
              .textContent(gettextCatalog.getString('Address')+" "+address+" "+gettextCatalog.getString('is not recognised'))
              .hideDelay(3000)
          );
        }

      };

      $scope.send = {
        cancel: cancel,
        validateAddress: validateAddress
      };
      $mdDialog.show({
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/addWatchOnlyAddress.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      });
    };

    function getAllDelegates(selectedAccount){
      function arrayUnique(array) {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
          for(var j=i+1; j<a.length; ++j) {
            if(a[i] && a[i].username === a[j].username)
              a.splice(j--, 1);
          }
        }
        return a;
      }
      if(selectedAccount.selectedVotes ){
        return arrayUnique(selectedAccount.selectedVotes.concat(selectedAccount.delegates))
      }
      else return selectedAccount.delegates;
    };

    function addDelegate(selectedAccount){
      var data={fromAddress: selectedAccount.address, delegates: [], registeredDelegates: {}};
      accountService.getActiveDelegates().then(function(r){data.registeredDelegates = r;});
      
      function add() {
        function indexOfDelegates(array,item){
          for(var i in array){
            if(array[i].username==item.username){
              console.log(array[i]);
              return i;
            }
          }
          return -1;
        };
        $mdDialog.hide();
        accountService.getDelegateByUsername(data.delegatename).then(
          function(delegate){
            if(self.selected.selectedVotes.length<101 && indexOfDelegates(selectedAccount.selectedVotes,delegate)<0){
              selectedAccount.selectedVotes.push(delegate);
            }
            else{
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
        function indexOfDelegates(array,item){
          for(var i in array){
            if(array[i].username==item.username){
              console.log(array[i]);
              return i;
            }
          }
          return -1;
        };
        $mdDialog.hide();
        accountService.getSponsors().then(
          function(sponsors){
            //check if sponsors are already voted
            if(self.selected.delegates){
              newsponsors=[];
              for(var i = 0 ; i<sponsors.length; i++){
                console.log(sponsors[i]);
                if(indexOfDelegates(self.selected.delegates,sponsors[i])<0){
                  newsponsors.push(sponsors[i]);
                }
              }
              sponsors=newsponsors;
            }

            for(var i = 0 ; i<sponsors.length; i++){
              if(self.selected.selectedVotes.length<101 && indexOfDelegates(selectedAccount.selectedVotes,sponsors[i])<0){
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
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/addDelegate.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    function vote(selectedAccount){
      var votes=accountService.createDiffVote(selectedAccount.address,selectedAccount.selectedVotes);
      if(!votes || votes.length==0){
        $mdToast.show(
          $mdToast.simple()
            .textContent(gettextCatalog.getString('No difference from original delegate list'))
            .hideDelay(5000)
        );
        return;
      }
      votes=votes[0];
      var passphrases = accountService.getPassphrases(selectedAccount.address);
      var data={fromAddress: selectedAccount.address, secondSignature:selectedAccount.secondSignature, votes:votes, passphrase: passphrases[0], secondpassphrase: passphrases[1]};
      console.log(data.votes);
      function next() {
        $mdDialog.hide();
        var publicKeys=$scope.voteDialog.data.votes.map(function(delegate){
          return delegate.vote+delegate.publicKey;
        }).join(",");
        console.log(publicKeys);
        accountService.createTransaction(3,
          {
            fromAddress: $scope.voteDialog.data.fromAddress,
            publicKeys: publicKeys,
            masterpassphrase: $scope.voteDialog.data.passphrase,
            secondpassphrase: $scope.voteDialog.data.secondpassphrase
          }
        ).then(
          function(transaction){
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
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/vote.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    function sendArk(selectedAccount){
      var passphrases = accountService.getPassphrases(selectedAccount.address);
      var data={
        fromAddress: selectedAccount ? selectedAccount.address: '',
        secondSignature: selectedAccount ? selectedAccount.secondSignature: '',
        passphrase: passphrases[0] ? passphrases[0] : '',
        secondpassphrase: passphrases[1] ? passphrases[1] : '',
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
        if (!$scope.sendArkForm.$valid){
          return ;
        }

        // remove bad characters before and after in case of bad copy/paste
        $scope.send.data.toAddress = $scope.send.data.toAddress.trim();
        $scope.send.data.passphrase = $scope.send.data.passphrase.trim();
        if ($scope.send.data.secondpassphrase){
          $scope.send.data.secondpassphrase = $scope.send.data.secondpassphrase.trim();
        }

        $mdDialog.hide();
        accountService.createTransaction(0,
          {
            fromAddress: $scope.send.data.fromAddress,
            toAddress: $scope.send.data.toAddress,
            amount: parseInt($scope.send.data.amount*100000000),
            smartbridge: $scope.send.data.smartbridge,
            masterpassphrase: $scope.send.data.passphrase,
            secondpassphrase: $scope.send.data.secondpassphrase
          }
        ).then(
          function(transaction){
            validateTransaction(selectedAccount, transaction);
          },
          formatAndToastError
        );
      };

      function querySearch(text){
        text=text.toLowerCase();
        var filter=self.accounts.filter(function(account){
          return (account.address.toLowerCase().indexOf(text)>-1) || (account.username && (account.username.toLowerCase().indexOf(text)>-1));
        });
        return filter;
      }

      function cancel() {
        $mdDialog.hide();
      };

      $scope.send = {
        data: data,
        cancel: cancel,
        next: next,
        querySearch: querySearch,
        fillSendableBalance: fillSendableBalance,
        totalBalance: totalBalance(false),
        remainingBalance: totalBalance(false), // <-- initial value, this will change by directive
      };

      $mdDialog.show({
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/sendArk.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    function manageBackgrounds(){
      var fs = require('fs');
      var path = require('path');
      var context = storageService.getContext();
      var currentNetwork = networkService.getNetwork();
      var initialBackground = currentNetwork.background;

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

      var imgPath = 'assets/img';
      var assetsPath = path.resolve(__dirname, imgPath);

      // find files in directory with same key
      for (var folder in backgrounds) {
        var fullPath = path.resolve(assetsPath, folder);

        if (fs.existsSync(path.resolve(fullPath))) { // check dir exists
          var image = {};
          fs.readdirSync(fullPath).forEach(function (file) {
            var stat = fs.statSync(path.join(fullPath, file)); // to prevent if directory

            if (stat.isFile()) {
              var url = path.join(imgPath, folder, file); // ex: assets/img/textures/file.png
              url = url.replace(/\\/g,"/");
              var name = path.parse(file).name; // remove extension
              image[name] = `url('${url}')`;
            }
          });
          backgrounds[folder] = image;
        }
      };

      function select(background) {
        $scope.send.selected = background;
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
      };

      $scope.send = {
        cancel: cancel,
        save: save,
        backgroundKeys: Object.keys(backgrounds),
        backgrounds: backgrounds,
        select: select,
        selected: initialBackground
      };

      $mdDialog.show({
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/manageBackground.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      });
    };

    function manageNetworks(){
      var networks=networkService.getNetworks();

      function save() {
        $mdDialog.hide();
        for(var network in $scope.send.networks){
          networkService.setNetwork(network, $scope.send.networks[network]);
        }
        window.location.reload();
      };

      function cancel() {
        $mdDialog.hide();
      };

      function createNetwork() {
        networkService.createNetwork($scope.send.createnetwork).then(
          function(network){

          },
          formatAndToastError
        );
      };

      $scope.send = {
        networkKeys: Object.keys(networks),
        networks: networks,
        createNetwork: createNetwork,
        cancel: cancel,
        save: save
      };

      $mdDialog.show({
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/manageNetwork.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      });
    };

    function openPassphrasesDialog(selectedAccount){
      var passphrases = accountService.getPassphrases(selectedAccount.address);
      var data={address: selectedAccount.address, passphrase: passphrases[0], secondpassphrase: passphrases[1]};
      function save() {
        $mdDialog.hide();
        accountService.savePassphrases($scope.send.data.address,$scope.send.data.passphrase, $scope.send.data.secondpassphrase).then(
          function(account){
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
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/savePassphrases.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    //register as delegate
    function createDelegate(selectedAccount){
      var passphrases = accountService.getPassphrases(selectedAccount.address);
      var data={fromAddress: selectedAccount.address, username: "", secondSignature:selectedAccount.secondSignature, passphrase: passphrases[0], secondpassphrase: passphrases[1]};

      function next() {
        $mdDialog.hide();

        var delegateName;
        try {
          delegateName = accountService.sanitizeDelegateName($scope.createDelegate.data.username)
        } catch (error) {
          return formatAndToastError(error)
        }

        accountService.createTransaction(2,
          {
            fromAddress: $scope.createDelegate.data.fromAddress,
            username: delegateName,
            masterpassphrase: $scope.createDelegate.data.passphrase,
            secondpassphrase: $scope.createDelegate.data.secondpassphrase
          }
        ).then(
          function(transaction){
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
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/createDelegate.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    //Create a new cold account
    function createAccount(){
      var bip39 = require("bip39");
      var data = { passphrase: bip39.generateMnemonic() };

      function next() {
        if(!$scope.createAccountDialog.data.showRepassphrase){
          $scope.createAccountDialog.data.repassphrase = $scope.createAccountDialog.data.passphrase;
          $scope.createAccountDialog.data.passphrase = "";
          $scope.createAccountDialog.data.showRepassphrase = true;
        }
        else{

          if (!$scope.createAccountForm.$valid) {
            return ;
          }

          var words = $scope.createAccountDialog.data.repassphrase.split(' ');
          if($scope.createAccountDialog.data.word3 === words[2] && $scope.createAccountDialog.data.word6 === words[5] && $scope.createAccountDialog.data.word9 === words[8]) {
            accountService.createAccount($scope.createAccountDialog.data.repassphrase).then(function(account){
              self.accounts.push(account);
              $mdToast.show(
                $mdToast.simple()
                  .textContent(gettextCatalog.getString('Account successfully created: ') + account.address)
                  .hideDelay(5000)
              );
              selectAccount(account);
            });
            $mdDialog.hide();
          }
          else{
            $scope.createAccountDialog.data.showWrongRepassphrase = true;
          }
        }
      };

      function querySearch(text){
        text=text.toLowerCase();
        var filter=self.accounts.filter(function(account){
          return (account.address.toLowerCase().indexOf(text)>-1) || (account.username && (account.username.toLowerCase().indexOf(text)>-1));
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
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/createAccount.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    function importAccount(){
      var data={
        passphrase: '',
        // TODO second passphrase
        // secondpassphrase: ''
      };

      function save(){
        if (!$scope.importAccountForm.$valid){
          return ;
        }

        accountService.createAccount($scope.send.data.passphrase)
        .then(
          function(account){
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
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/importAccount.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    // Add a second passphrase to an account
    function createSecondPassphrase(account){
      var bip39 = require("bip39");
      var data = { secondPassphrase: bip39.generateMnemonic() };

      if (account.secondSignature) {
        return formatAndToastError(
          gettextCatalog.getString('This account already has a second passphrase: ' + account.address)
        );
      }

      function next() {
        if(!$scope.createSecondPassphraseDialog.data.showRepassphrase){
          $scope.createSecondPassphraseDialog.data.reSecondPassphrase = $scope.createSecondPassphraseDialog.data.secondPassphrase;
          $scope.createSecondPassphraseDialog.data.secondPassphrase = "";
          $scope.createSecondPassphraseDialog.data.showRepassphrase = true;
        }
        else if($scope.createSecondPassphraseDialog.data.reSecondPassphrase !== $scope.createSecondPassphraseDialog.data.secondPassphrase){
          $scope.createSecondPassphraseDialog.data.showWrongRepassphrase = true;
        }
        else{
          accountService.createTransaction(1,
            {
              fromAddress: account.address,
              masterpassphrase: $scope.createSecondPassphraseDialog.data.passphrase,
              secondpassphrase: $scope.createSecondPassphraseDialog.data.reSecondPassphrase
            }
          ).then(
            function(transaction){
              networkService.postTransaction(transaction).then(
                function(transaction){
                  $mdToast.show(
                    $mdToast.simple()
                      .textContent(gettextCatalog.getString('Second Passphrase added successfully: ') + account.address)
                      .hideDelay(5000)
                  );
                },
                formatAndToastError
              );
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
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/createSecondPassphrase.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      });
    };

    /**
     * Show the Contact view in the bottom sheet
     */
    function showAccountMenu(selectedAccount) {

      var account = selectedAccount;

      var items = [
        { name: gettextCatalog.getString('Open in explorer'), icon: 'visibility'},
        { name: gettextCatalog.getString('Remove'), icon: 'clear'},
      ];

      if(!selectedAccount.delegate){
        items.push({ name: gettextCatalog.getString('Label'), icon: 'local_offer'});
        items.push({ name: gettextCatalog.getString('Register Delegate'), icon: 'local_offer'});
      }

      if(!selectedAccount.secondSignature){
        items.push({ name: gettextCatalog.getString('Second Passphrase'), icon: 'local_offer'});
      }

      function answer(action){
        $mdBottomSheet.hide();

        if(action==gettextCatalog.getString('Open in explorer')){
          openExplorer('/address/' + selectedAccount.address)
        }

        else if(action==gettextCatalog.getString("Remove")){
          var confirm = $mdDialog.confirm()
              .title(gettextCatalog.getString('Remove Account')+ ' ' +account.address)
              .textContent(gettextCatalog.getString('Remove this account from your wallet. ' +
                  'The account may be added again using the original passphrase of the account.'))
              .ok(gettextCatalog.getString('Remove account'))
              .cancel(gettextCatalog.getString('Cancel'));
          $mdDialog.show(confirm).then(function() {
            accountService.removeAccount(account).then(function(){
              self.accounts = accountService.loadAllAccounts();

              if(self.accounts.length>0) {
                selectAccount(self.accounts[0]);
              }
              else {
                self.selected = null
              }

              $mdToast.show(
                $mdToast.simple()
                  .textContent(gettextCatalog.getString('Account removed!'))
                  .hideDelay(3000)
              );
            });
          });
        }

        else if(action==gettextCatalog.getString("Send Ark")){
          sendArk();
        }

        else if(action==gettextCatalog.getString("Register Delegate")){
          createDelegate(selectedAccount);
        }

        else if (action==gettextCatalog.getString("Label")) {
          var prompt = $mdDialog.prompt()
              .title(gettextCatalog.getString('Label'))
              .textContent(gettextCatalog.getString('Please enter a short label.'))
              .placeholder(gettextCatalog.getString('label'))
              .ariaLabel(gettextCatalog.getString('Label'))
              .ok(gettextCatalog.getString('Set'))
              .cancel(gettextCatalog.getString('Cancel'));
          $mdDialog.show(prompt).then(function(label) {
            accountService.setUsername(selectedAccount.address,label);
            self.accounts = accountService.loadAllAccounts();
            $mdToast.show(
              $mdToast.simple()
                .textContent(gettextCatalog.getString('Label set'))
                .hideDelay(3000)
            );
          });
        }

        else if (action==gettextCatalog.getString("Second Passphrase")) {
          createSecondPassphrase(account);
        }
      };

      $scope.bs={
        address: account.address,
        answer: answer,
        items: items
      };

      $mdBottomSheet.show({
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/contactSheet.html',
        clickOutsideToClose: true,
        preserveScope: true,
        scope: $scope
      });

    }


    function validateTransaction(selectedAccount, transaction){

      function send() {
        $mdDialog.hide();

        transaction = accountService.formatTransaction(transaction, selectedAccount.address);
        transaction.confirmations = 0;
        selectedAccount.transactions.unshift(transaction);

        networkService.postTransaction(transaction).then(
          function(transaction){
            $mdToast.show(
              $mdToast.simple()
                .textContent(gettextCatalog.getString('Transaction')+ ' ' +transaction.id + ' ' +gettextCatalog.getString('sent with success!'))
                .hideDelay(5000)
            );
          },
          formatAndToastError
        );
      };

      function cancel() {
        $mdDialog.hide();
      };

      $scope.validate={
        send:send,
        cancel:cancel,
        transaction:transaction,
        // to avoid small transaction to be displayed as 1e-8
        humanAmount: accountService.numberToFixed(transaction.amount / 100000000) + '',
      };

      $mdDialog.show({
        scope              : $scope,
        preserveScope      : true,
        parent             : angular.element(document.getElementById('app')),
        templateUrl        : './src/accounts/view/showTransaction.html',
        clickOutsideToClose: false
      });
    };

  }

})();
