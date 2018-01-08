;(function () {
  'use strict'

  angular
    .module('arkclient.accounts')
    .controller('AccountController', [
      'accountService',
      'networkService',
      'pluginLoader',
      'storageService',
      'ledgerService',
      'timeService',
      'toastService',
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
      '$rootScope',
      'transactionBuilderService',
      'utilityService',
      AccountController
    ])

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function AccountController (
    accountService,
    networkService,
    pluginLoader,
    storageService,
    ledgerService,
    timeService,
    toastService,
    $mdSidenav,
    $mdBottomSheet,
    $timeout,
    $interval,
    $log,
    $mdDialog,
    $scope,
    $mdMedia,
    gettextCatalog,
    $mdThemingProvider,
    $mdTheming,
    $window,
    $rootScope,
    transactionBuilderService,
    utilityService
  ) {
    const _path = require('path')

    const self = this

    const languages = {
      en: gettextCatalog.getString('English'),
      ar: gettextCatalog.getString('Arabic'),
      bg_BG: gettextCatalog.getString('Bulgarian'),
      zh_CN: gettextCatalog.getString('Chinese - China'),
      zh_TW: gettextCatalog.getString('Chinese - Taiwan'),
      nl: gettextCatalog.getString('Dutch'),
      fi: gettextCatalog.getString('Finish'),
      fr: gettextCatalog.getString('French'),
      de: gettextCatalog.getString('German'),
      el: gettextCatalog.getString('Greek'),
      hu: gettextCatalog.getString('Hungarish'),
      id: gettextCatalog.getString('Indonesian'),
      it: gettextCatalog.getString('Italian'),
      ja: gettextCatalog.getString('Japanese'),
      ko: gettextCatalog.getString('Korean'),
      pl: gettextCatalog.getString('Polish'),
      pt_BR: gettextCatalog.getString('Portuguese - Brazil'),
      pt_PT: gettextCatalog.getString('Portuguese - Portugal'),
      ro: gettextCatalog.getString('Romanian'),
      ru: gettextCatalog.getString('Russian'),
      sr: gettextCatalog.getString('Serbian'),
      sk: gettextCatalog.getString('Slovak'),
      sl: gettextCatalog.getString('Slovenian'),
      es_419: gettextCatalog.getString('Spanish'),
      sv: gettextCatalog.getString('Swedish')
    }

    pluginLoader.triggerEvent('onStart')

    self.currencies = [
      { name: 'btc', symbol: 'Ƀ' },
      { name: 'usd', symbol: '$' },
      { name: 'aud', symbol: 'A$' },
      { name: 'brl', symbol: 'R$' },
      { name: 'cad', symbol: 'Can$' },
      { name: 'chf', symbol: 'Fr.' },
      { name: 'cny', symbol: 'CN¥' },
      { name: 'eur', symbol: '€' },
      { name: 'gbp', symbol: '£' },
      { name: 'hkd', symbol: 'HK$' },
      { name: 'idr', symbol: 'Rp' },
      { name: 'inr', symbol: '₹' },
      { name: 'jpy', symbol: 'JP¥' },
      { name: 'krw', symbol: '₩' },
      { name: 'mxn', symbol: 'Mex$' },
      { name: 'rub', symbol: '\u20BD' }
    ]

    gettextCatalog.debug = false
    self.language = storageService.get('language') || 'en'
    self.selectedLanguage = self.language
    gettextCatalog.setCurrentLanguage(self.language)

    self.getLanguage = function () {
      return languages[self.language]
    }

    $window.onbeforeunload = function () {
      storageService.saveState()
    }

    self.closeApp = function () {
      const confirm = $mdDialog.confirm()
        .title(gettextCatalog.getString('Quit Ark Client?'))
        .theme(self.currentTheme)
        .ok(gettextCatalog.getString('Quit'))
        .cancel(gettextCatalog.getString('Cancel'))
      $mdDialog.show(confirm).then(() => {
        require('electron').remote.app.quit()
      })
    }

    self.windowApp = function (action, args) {
      const curWin = require('electron').remote.getCurrentWindow()
      if (curWin[action]) return curWin[action](args)

      return null
    }

    self.clearData = function () {
      const confirm = $mdDialog.confirm()
        .title(gettextCatalog.getString('Are you sure?'))
        .theme(self.currentTheme)
        .textContent(gettextCatalog.getString('All your data, including created accounts, networks and contacts will be removed from the app and reset to default.'))
        .ariaLabel(gettextCatalog.getString('Confirm'))
        .ok(gettextCatalog.getString('Yes'))
        .cancel(gettextCatalog.getString('Cancel'))

      $mdDialog.show(confirm).then(() => {
        storageService.clearData()
        self.windowApp('reload')
      })
    }

    self.createRefreshState = (successMessage, errorMessage) => {
      const stateObject = {}

      stateObject.states = []

      stateObject.isRefreshing = false

      stateObject.create = () => {
        const state = { isFinished: false, hasError: false }
        stateObject.states.push(state)
        return state
      }

      stateObject.shouldRefresh = () => {
        if (stateObject.isRefreshing) {
          return false
        }

        stateObject.isRefreshing = true
        return true
      }

      stateObject.updateRefreshState = (showToast) => {
        const areAllFinished = stateObject.states.every(state => state.isFinished)
        const hasAnyError = stateObject.states.some(state => state.hasError)

        if (!areAllFinished) {
          return
        }

        stateObject.isRefreshing = false
        stateObject.states = []

        if (!showToast) {
          return
        }

        if (!hasAnyError) {
          toastService.success(successMessage, 3000)
        } else {
          toastService.error(errorMessage, 3000)
        }
      }

      return stateObject
    }

    self.clientVersion = require(_path.resolve(__dirname, '../../package.json')).version
    self.latestClientVersion = self.clientVersion
    self.openExplorer = openExplorer
    self.timestamp = timestamp
    self.showValidateTransaction = showValidateTransaction
    networkService.getLatestClientVersion().then((r) => { self.latestClientVersion = r })
    self.isNetworkConnected = false
    self.selected = null
    self.accounts = []
    self.selectAccount = selectAccount
    self.refreshCurrentAccount = refreshCurrentAccount
    self.accountRefreshState = self.createRefreshState('Account refreshed', 'Could not refresh account')
    self.accountsRefreshState = self.createRefreshState('Accounts refreshed', 'Could not refresh accounts')
    self.gotoAddress = gotoAddress
    self.getAllDelegates = getAllDelegates
    self.addWatchOnlyAddress = addWatchOnlyAddress
    self.createAccount = createAccount
    self.importAccount = importAccount
    self.toggleList = toggleAccountsList
    self.createSecondPassphrase = createSecondPassphrase
    self.exportAccount = exportAccount
    self.formatAndToastError = formatAndToastError

    self.refreshAccountsAutomatically = storageService.get('refreshAccountsAutomatically') || false
    self.playFundsReceivedSound = storageService.get('playFundsReceivedSound') || false
    self.togglePlayFundsReceivedSound = togglePlayFundsReceivedSound
    self.manageBackgrounds = manageBackgrounds
    self.showExchangeRate = showExchangeRate
    self.manageNetworks = manageNetworks
    self.openPassphrasesDialog = openPassphrasesDialog
    self.createDelegate = createDelegate
    self.currency = storageService.get('currency') || self.currencies[0]
    self.switchNetwork = networkService.switchNetwork
    self.marketinfo = {}
    self.network = networkService.getNetwork()
    self.listNetworks = networkService.getNetworks()
    self.context = storageService.getContext()
    self.btcValueActive = false

    self.bitcoinCurrency = self.currencies.find((currency) => {
      return currency.name === 'btc'
    })
    self.toggleCurrency = self.bitcoinCurrency

    self.connectedPeer = { isConnected: false }

    if (!self.network.theme) self.network.theme = 'default'
    if (!self.network.themeDark) self.network.themeDark = false

    // will be used in view
    self.currentTheme = 'default'// self.network.theme

    // set 'dynamic' as the default theme
    generateDynamicPalette((name) => {
      if (name && self.network.theme === name) {
        self.network.theme = name
      }
      // generate dark theme after load the dynamic
      generateDarkTheme()
    })

    // set dark mode
    // if (self.network.themeDark) {self.currentTheme = 'dark'}

    // refreshing displayed account every 8s
    $interval(() => {
      const selected = self.selected
      if (!selected) return

      const transactions = selected.transactions || []

      if (transactions.length > 0 && transactions[0].confirmations === 0) {
        return self.refreshCurrentAccount()
      }

      if (self.refreshAccountsAutomatically) {
        return self.refreshCurrentAccount()
      }
    }, 8 * 1000)

    let nocall = false

    // detect Ledger
    $interval(() => {
      if (nocall) {
        return
      }
      if (!self.ledgerAccounts && self.ledger && self.ledger.connected) {
        console.log('ledgerService.getBip44Accounts')
        nocall = true
        ledgerService.getBip44Accounts(self.network.slip44).then(
          (accounts) => {
            self.ledgerAccounts = accounts
            self.ledger.conneted = true
            nocall = false
          },
          () => {
            self.ledgerAccounts = null
            self.ledger = { connected: false }
            nocall = false
          }
        )
      }
      if (ledgerService.detect().status === 'Success') {
        self.ledger = ledgerService.isAppLaunched()
        if (!self.ledger.connected) {
          self.ledgerAccounts = null
        }
      } else {
        self.ledgerAccounts = null
        self.ledger = { connected: false }
      }
    }, 2 * 1000)

    // TODO Used in dashboard navbar and accountBox
    self.selectLedgerAccount = function (account) {
      if (!account && self.ledgerAccounts) {
        account = self.ledgerAccounts[0]
      }
      if (account) {
        self.selectAccount(account)
      }
    }

    self.connection = networkService.getConnection()

    self.connection.then(
      () => {},
      () => {},
      (connectedPeer) => {
        self.connectedPeer = connectedPeer

        // Wait a little to ignore the initial connection delay and short interruptions
        $timeout(() => {
          if (!self.connectedPeer.isConnected && self.isNetworkConnected) {
            self.isNetworkConnected = false
            toastService.error('Network disconnected!')
          } else if (self.connectedPeer.isConnected && !self.isNetworkConnected) {
            self.isNetworkConnected = true
            self.refreshAccountBalances()
            toastService.success('Network connected and healthy!')
          }
        }, 500)
      }
    )

    // get themes colors to show in manager appearance
    function reloadThemes () {
      const currentThemes = $mdThemingProvider.$get().THEMES
      const mapThemes = {}

      Object.keys(currentThemes).forEach((theme) => {
        const colors = currentThemes[theme].colors
        const names = []

        for (const color in colors) {
          names.push('default-' + colors[color].name)
        }

        mapThemes[theme] = names
      })

      return mapThemes
    }

    function openExplorer (uri) {
      require('electron').shell.openExternal(self.network.explorer + uri)
    }

    function formatErrorMessage (error) {
      let basicMessage = ''
      if (typeof error === 'string') {
        basicMessage = error
      } else if (typeof error.error === 'string') {
        basicMessage = error.error
      } else if (typeof error.data === 'string') {
        basicMessage = error.data
      } else if (typeof error.message === 'string') {
        basicMessage = error.message
      }
      const errorMessage = gettextCatalog.getString('Error: ') + basicMessage.replace('Error: ', '')
      console.error(errorMessage, '\n', error)
      return errorMessage
    }

    function formatAndToastError (error, hideDelay) {
      if (!hideDelay) {
        hideDelay = 5000
      }
      toastService.error(formatErrorMessage(error), hideDelay, true)
    }

    // TODO: deprecated
    // function showToast (msg, hideDelay, isError) {
    //   if (!hideDelay) {
    //     hideDelay = 5000
    //   }

    //   var toast = $mdToast.simple()
    //     .hideDelay(hideDelay)
    //     .textContent(gettextCatalog.getString(msg))

    //   if (isError) {
    //     toast.theme('error')
    //   }

    //   $mdToast.show(toast)
    // }

    self.selectAllLanguages = function () {
      return languages
    }

    self.setLanguage = function () {
      function getlanguage (value) {
        for (const prop in languages) {
          if (languages.hasOwnProperty(prop)) {
            if (languages[prop] === value) {
              return prop
            }
          }
        }
      }
      self.language = getlanguage(this.selectedLanguage)
      storageService.set('language', self.language)
      gettextCatalog.setCurrentLanguage(self.language)
    }

    // Load all registered accounts
    self.accounts = accountService.loadAllAccounts()

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleAccountsList () {
      if ($mdMedia('md') || $mdMedia('sm')) $mdSidenav('left').toggle()
    }

    self.getAllAccounts = function () {
      let accounts = self.myAccounts()
      if (self.ledgerAccounts && self.ledgerAccounts.length) {
        accounts = accounts.concat(self.ledgerAccounts)
      }

      return accounts
    }

    self.myAccounts = function () {
      return self.accounts.filter((account) => {
        return !!account.virtual
      }).sort((a, b) => {
        return b.balance - a.balance
      })
    }

    self.toggleBitcoinCurrency = function (force) {
      self.btcValueActive = force !== undefined ? force : !self.btcValueActive
      self.toggleCurrency = self.btcValueActive ? self.currency : self.bitcoinCurrency
    }

    self.otherAccounts = function () {
      return self.accounts.filter((account) => {
        return !account.virtual
      }).sort((a, b) => {
        return b.balance - a.balance
      })
    }

    self.openMenu = function ($mdMenuOpen, ev) {
      // originatorEv = ev // unused
      $mdMenuOpen(ev)
    }

    self.selectNextCurrency = function () {
      self.toggleBitcoinCurrency(false)
      const currenciesNames = self.currencies.map((x) => {
        return x.name
      })
      const currencyIndex = currenciesNames.indexOf(self.currency.name)
      const newIndex = currencyIndex === currenciesNames.length - 1 ? 0 : currencyIndex + 1

      self.currency = self.currencies[newIndex]
      self.changeCurrency()
    }

    self.changeCurrency = function () {
      self.toggleBitcoinCurrency(false)
      if (self.currency === 'undefined') self.currency = self.currencies[0]
      storageService.set('currency', self.currency)
    }

    self.pickRandomPeer = function () {
      networkService.pickRandomPeer()
    }

    self.getDefaultValue = function (account) {
      let amount = account.balance
      if (account.virtual) {
        for (const folder in account.virtual) {
          if (account.virtual[folder].amount) {
            amount = amount - account.virtual[folder].amount
          }
        }
      }
      return amount
    }

    self.saveFolder = function (account, folder) {
      accountService.setToFolder(account.address, folder, utilityService.arkToArktoshi(account.virtual.uservalue(folder)()))
    }

    self.deleteFolder = function (account, foldername) {
      account.virtual = accountService.deleteFolder(account.address, foldername)
    }

    self.manageFolder = function (account, currentFolderName) {
      const titleText = (!currentFolderName ? 'Create' : 'Rename') + ' Virtual Folder'
      const buttonText = (!currentFolderName ? 'Add' : 'Save')
      const confirmText = 'Virtual folder ' + (!currentFolderName ? 'added' : 'saved') + '!'
      const currentValue = (!currentFolderName ? null : currentFolderName)
      let confirm

      if (account.virtual) {
        confirm = $mdDialog.prompt()
          .title(gettextCatalog.getString(titleText))
          .theme(self.currentTheme)
          .textContent(gettextCatalog.getString('Please enter a folder name.'))
          .placeholder(gettextCatalog.getString('Folder name'))
          .initialValue(currentValue)
          .ariaLabel(gettextCatalog.getString('Folder Name'))
          .ok(gettextCatalog.getString(buttonText))
          .cancel(gettextCatalog.getString('Cancel'))
        $mdDialog.show(confirm).then((foldername) => {
          if (account.virtual[foldername]) {
            formatAndToastError(gettextCatalog.getString(
              'A folder with that name already exists.'
            ))
          } else {
            if (!currentFolderName) {
              account.virtual = accountService.setToFolder(account.address, foldername, 0)
            } else {
              account.virtual = accountService.renameFolder(account.address, currentFolderName, foldername)
            }
            toastService.success(confirmText, 3000)
          }
        })
      } else {
        confirm = $mdDialog.prompt()
          .title(gettextCatalog.getString('Login'))
          .theme(self.currentTheme)
          .textContent(gettextCatalog.getString('Please enter this account passphrase to login.'))
          .placeholder(gettextCatalog.getString('passphrase'))
          .ariaLabel(gettextCatalog.getString('Passphrase'))
          .ok(gettextCatalog.getString('Login'))
          .cancel(gettextCatalog.getString('Cancel'))
        $mdDialog.show(confirm).then((passphrase) => {
          accountService.createVirtual(passphrase).then((virtual) => {
            account.virtual = virtual
            toastService.success('Succesfully Logged In!', 3000)
          }, (err) => {
            toastService.success(gettextCatalog.getString('Error when trying to login: ') + err, 3000, true)
          })
        })
      }
    }

    function gotoAddress (address) {
      const currentaddress = address

      accountService.fetchAccountAndForget(currentaddress).then((a) => {
        self.selected = a

        $timeout(() => {
          // pluginLoader.triggerEvent("onSelectAccount", self.selected)
          $scope.$broadcast('account:onSelect', self.selected)
        })

        if (self.selected.delegates) {
          self.selected.selectedVotes = self.selected.delegates.slice(0)
        } else {
          self.selected.selectedVotes = []
        }
        accountService
          .refreshAccount(self.selected)
          .then((account) => {
            if (self.selected.address === currentaddress) {
              self.selected.balance = account.balance
              self.selected.secondSignature = account.secondSignature
              self.selected.cold = account.cold
              self.selected.publicKey = account.publicKey

              if (!self.selected.virtual) self.selected.virtual = account.virtual
            }
          })
        accountService
          .getTransactions(currentaddress)
          .then((transactions) => {
            if (self.selected.address === currentaddress) {
              if (!self.selected.transactions) {
                self.selected.transactions = transactions
              } else {
                transactions = transactions.sort((a, b) => {
                  return b.timestamp - a.timestamp
                })

                let previousTx = [...self.selected.transactions]
                self.selected.transactions = transactions

                // if the previous tx was unconfirmed, rebroadcast and put it back at the top (for better UX)
                if (previousTx.length && !previousTx[0].confirmations && previousTx[0].id !== transactions[0].id) {
                  networkService.broadcastTransaction(previousTx[0])
                  self.selected.transactions.unshift(previousTx[0])
                }

                previousTx = null
              }
              $timeout(() => {
                $scope.$broadcast('account:onRefreshTransactions', self.selected.transactions)
              })
            }
          })
        accountService
          .getVotedDelegates(self.selected.address)
          .then((delegates) => {
            if (self.selected.address === currentaddress) {
              self.selected.delegates = delegates
              self.selected.selectedVotes = delegates.slice(0)
            }
          })
        accountService
          .getDelegate(self.selected.publicKey)
          .then((delegate) => {
            if (self.selected.address === currentaddress) {
              self.selected.delegate = delegate
            }
          })
      })
    }

    function refreshCurrentAccount (showToast) {
      if (!self.accountRefreshState.shouldRefresh()) {
        return
      }

      const accountState = self.accountRefreshState.create()
      const transactionsState = self.accountRefreshState.create()

      const myaccount = self.selected
      accountService
        .refreshAccount(myaccount)
        .then((account) => {
          if (self.selected.address === myaccount.address) {
            self.selected.balance = account.balance
            self.selected.secondSignature = account.secondSignature
            self.selected.cold = account.cold
            if (!self.selected.publicKey) self.selected.publicKey = account.publicKey

            if (!self.selected.virtual) self.selected.virtual = account.virtual
          }
        })
        .catch(() => {
          accountState.hasError = true
        })
        .finally(() => {
          accountState.isFinished = true
          self.accountRefreshState.updateRefreshState(showToast)
        })
      accountService
        .getTransactions(myaccount.address)
        .then((transactions) => {
          if (self.selected.address === myaccount.address) {
            if (!self.selected.transactions) {
              self.selected.transactions = transactions
            } else {
              transactions = transactions.sort((a, b) => {
                return b.timestamp - a.timestamp
              })

              let previousTx = [...self.selected.transactions]
              self.selected.transactions = transactions

              const playSong = storageService.get('playFundsReceivedSong')
              if (playSong === true && previousTx[0].id !== transactions[0].id && transactions[0].type === 0 && transactions[0].recipientId === myaccount.address) {
                const wavFile = _path.resolve(__dirname, 'assets/audio/power-up.wav')
                const audio = new Audio(wavFile)
                audio.play()
              }

              // if the previous tx was unconfirmed, put it back at the top (for better UX)
              if (previousTx.length && !previousTx[0].confirmations && previousTx[0].id !== transactions[0].id) {
                networkService.broadcastTransaction(previousTx[0])
                self.selected.transactions.unshift(previousTx[0])
              }

              previousTx = null
            }
            $timeout(() => {
              $scope.$broadcast('account:onRefreshTransactions', self.selected.transactions)
            })
          }
        })
        .catch(() => {
          transactionsState.hasError = true
        })
        .finally(() => {
          transactionsState.isFinished = true
          self.accountRefreshState.updateRefreshState(showToast)
        })
    }

    self.refreshAccountBalances = (showToast) => {
      const accounts = self.getAllAccounts()

      if (!accounts.length || !self.accountsRefreshState.shouldRefresh()) {
        return
      }

      networkService.getPrice()

      accounts.forEach(account => {
        const state = self.accountsRefreshState.create()
        accountService
          .refreshAccount(account)
          .then(updated => { account.balance = updated.balance })
          .catch(() => { state.hasError = true })
          .finally(() => {
            state.isFinished = true
            self.accountsRefreshState.updateRefreshState(showToast)
          })
      })
    }

    self.toggleRefreshAccountsAutomatically = function () {
      storageService.set('refreshAccountsAutomatically', self.refreshAccountsAutomatically, true)
    }

    function togglePlayFundsReceivedSound (status) {
      storageService.set('playFundsReceivedSound', self.playFundsReceivedSound, true)
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    // TODO Used in dashboard navbar and accountBox
    function selectAccount (account) {
      const currentaddress = account.address
      self.selected = accountService.getAccount(currentaddress)
      self.selected.ledger = account.ledger

      $timeout(() => {
        // pluginLoader.triggerEvent("onSelectAccount", self.selected)
        $scope.$broadcast('account:onSelect', self.selected)
      })

      self.showPublicKey = false

      loadSignedMessages()
      if (!self.selected.selectedVotes) {
        if (self.selected.delegates) {
          self.selected.selectedVotes = self.selected.delegates.slice(0)
        } else self.selected.selectedVotes = []
      }
      accountService
        .refreshAccount(self.selected)
        .then((account) => {
          if (self.selected.address === currentaddress) {
            self.selected.balance = account.balance
            self.selected.secondSignature = account.secondSignature
            self.selected.cold = account.cold
            if (!self.selected.publicKey) self.selected.publicKey = account.publicKey

            if (!self.selected.virtual) self.selected.virtual = account.virtual
          }
        })
      accountService
        .getTransactions(currentaddress)
        .then((transactions) => {
          if (self.selected.address === currentaddress) {
            if (!self.selected.transactions) {
              self.selected.transactions = transactions
            } else {
              transactions = transactions.sort((a, b) => {
                return b.timestamp - a.timestamp
              })

              let previousTx = [...self.selected.transactions]
              self.selected.transactions = transactions

              const playSound = storageService.get('playFundsReceivedSound')
              if (playSound === true && transactions.length > previousTx.length && transactions[0].type === 0 && transactions[0].recipientId === self.selected.address) {
                const wavFile = _path.resolve(__dirname, 'assets/audio/power-up.wav')
                const audio = new Audio(wavFile)
                audio.play()
              }

              // if the previous tx was unconfirmed, but it back at the top (for better UX)
              if (previousTx.length && !previousTx[0].confirmations && previousTx[0].id !== transactions[0].id) {
                networkService.broadcastTransaction(previousTx[0])
                self.selected.transactions.unshift(previousTx[0])
              }

              previousTx = null
            }
            $timeout(() => {
              $scope.$broadcast('account:onRefreshTransactions', self.selected.transactions)
            })
          }
        })
      accountService
        .getVotedDelegates(self.selected.address)
        .then((delegates) => {
          if (self.selected.address === currentaddress) {
            self.selected.delegates = delegates
            self.selected.selectedVotes = delegates.slice(0)
          }
        })
      accountService
        .getDelegate(self.selected.publicKey)
        .then((delegate) => {
          if (self.selected.address === currentaddress) {
            self.selected.delegate = delegate
          }
        })
    }

    /**
     * Add an account
     */
    function addWatchOnlyAddress () {
      function cancel () {
        $mdDialog.hide()
      }

      function validateAddress () {
        const isAddress = /^[1-9A-Za-z]+$/g
        const address = $scope.address
        if (isAddress.test(address)) {
          accountService.fetchAccount(address).then((account) => {
            self.accounts.push(account)
            selectAccount(account)
            toastService.success('Account added!', 3000)
          })
          cancel()
        } else {
          toastService.error(
            gettextCatalog.getString('Address') + ' ' + address + ' ' + gettextCatalog.getString('is not recognised'),
            3000,
            true
          )
        }
      }

      $scope.send = {
        cancel: cancel,
        validateAddress: validateAddress
      }
      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/addWatchOnlyAddress.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      })
    }

    function getAllDelegates (selectedAccount) {
      function arrayUnique (array) {
        const a = array.concat()
        for (let i = 0; i < a.length; ++i) {
          for (let j = i + 1; j < a.length; ++j) {
            if (a[i] && a[i].username === a[j].username) a.splice(j--, 1)
          }
        }
        return a
      }
      if (selectedAccount.selectedVotes) {
        return arrayUnique(selectedAccount.selectedVotes.concat(selectedAccount.delegates))
      } else return selectedAccount.delegates
    }

    function timestamp (selectedAccount) {
      const passphrases = accountService.getPassphrases(selectedAccount.address)
      const data = {
        ledger: selectedAccount.ledger,
        fromAddress: selectedAccount ? selectedAccount.address : '',
        secondSignature: selectedAccount ? selectedAccount.secondSignature : '',
        passphrase: passphrases[0] ? passphrases[0] : '',
        secondpassphrase: passphrases[1] ? passphrases[1] : ''
      }

      function next () {
        // remove bad characters before and after in case of bad copy/paste
        $scope.send.data.passphrase = $scope.send.data.passphrase.trim()
        if ($scope.send.data.secondpassphrase) {
          $scope.send.data.secondpassphrase = $scope.send.data.secondpassphrase.trim()
        }

        $mdDialog.hide()
        const smartbridge = $scope.send.data.smartbridge
        transactionBuilderService.createSendTransaction({
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          fromAddress: $scope.send.data.fromAddress,
          toAddress: $scope.send.data.fromAddress,
          amount: 1,
          smartbridge: smartbridge,
          masterpassphrase: $scope.send.data.passphrase,
          secondpassphrase: $scope.send.data.secondpassphrase
        }).then(
          (transaction) => {
            showValidateTransaction(selectedAccount, transaction)
          },
          formatAndToastError
        )
      }

      function openFile () {
        const crypto = require('crypto')
        const fs = require('fs')

        require('electron').remote.dialog.showOpenDialog((fileNames) => {
          if (fileNames === undefined) return
          const fileName = fileNames[0]
          const algo = 'sha256'
          const shasum = crypto.createHash(algo)
          $scope.send.data.filename = fileName
          $scope.send.data.smartbridge = 'Calculating signature....'
          const s = fs.ReadStream(fileName)

          s.on('data', (d) => { shasum.update(d) })
          s.on('end', () => {
            const d = shasum.digest('hex')
            $scope.send.data.smartbridge = d
          })
        })
      }

      function cancel () {
        $mdDialog.hide()
      }

      $scope.send = {
        data: data,
        openFile: openFile,
        cancel: cancel,
        next: next
      }

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/timestampDocument.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      })
    }

    function sortObj (obj) {
      return Object.keys(obj).sort((a, b) => {
        return obj[a] - obj[b]
      })
    }

    function generateDarkTheme (themeName) {
      const theme = themeName || self.network.theme
      let properties = $mdThemingProvider.$get().THEMES[theme]
      properties = properties || $mdThemingProvider.$get().THEMES['default']

      const colors = properties.colors
      const primary = colors.primary.name
      const accent = colors.accent.name
      const warn = colors.warn.name
      const background = colors.background.name

      $mdThemingProvider.theme('dark')
        .primaryPalette(primary)
        .accentPalette(accent)
        .warnPalette(warn)
        .backgroundPalette(background)
        .dark()
      $mdThemingProvider.$get().generateTheme('dark')
      // set dark mode
      if (self.network.themeDark) { self.currentTheme = 'dark' }
    }

    // Compare vibrant colors from image with default material palette
    // And returns the most similar primary and accent palette
    function generateDynamicPalette (callback) {
      if (!self.network.background) {
        callback(false) // eslint-disable-line standard/no-callback-literal
        return
      }

      const vibrant = require('node-vibrant')
      const materialPalette = $mdThemingProvider.$get().PALETTES

      // check if it's an image url
      const regExp = /\(([^)]+)\)/
      const match = self.network.background.match(regExp)

      if (!match) {
        callback(false) // eslint-disable-line standard/no-callback-literal
        return
      }

      const url = _path.resolve(__dirname, match[1].replace(/'/g, ''))

      vibrant.from(url).getPalette((err, palette) => {
        if (err || !palette.Vibrant) {
          callback(false) // eslint-disable-line standard/no-callback-literal
          return
        }

        const vibrantRatio = {}
        const darkVibrantRatio = {}

        Object.keys(materialPalette).forEach((color) => {
          const vibrantDiff = vibrant.Util.hexDiff(materialPalette[color]['900']['hex'], palette.Vibrant.getHex())
          vibrantRatio[color] = vibrantDiff

          const darkVibrantDiff = vibrant.Util.hexDiff(materialPalette[color]['900']['hex'], palette.DarkVibrant.getHex())
          darkVibrantRatio[color] = darkVibrantDiff
        })

        const isArkJpg = _path.basename(url) === 'Ark.jpg'
        let primaryColor = isArkJpg ? 'red' : sortObj(darkVibrantRatio)[0]
        let accentColor = sortObj(vibrantRatio)[0]

        primaryColor = primaryColor === 'grey' ? 'blue-grey' : primaryColor

        if (accentColor === 'grey' || accentColor === primaryColor) {
          accentColor = sortObj(vibrantRatio)[1]
        }

        $mdThemingProvider.theme('dynamic').primaryPalette(primaryColor).accentPalette(accentColor)
        $mdThemingProvider.$get().generateTheme('dynamic')

        self.currentTheme = self.network.theme

        callback('dynamic') // eslint-disable-line standard/no-callback-literal
      })
    }

    function manageBackgrounds () {
      const fs = require('fs')
      const context = storageService.getContext()

      const currentNetwork = networkService.getNetwork()

      const initialBackground = currentNetwork.background
      const initialTheme = currentNetwork.theme

      let currentTheme = self.currentTheme
      const initialThemeView = currentTheme
      const initialDarkMode = currentNetwork.themeDark

      const themes = reloadThemes()
      delete themes['dark']

      const selectedTab = 0

      const backgrounds = {
        user: {},
        colors: {
          'Midnight': '#2c3e50',
          'Asbestos': '#7f8c8d',
          'Wisteria': '#674172',
          'Belize Hole': '#2980b9'
        },
        textures: {},
        images: {}
      }

      const imgPath = 'assets/images'
      const assetsPath = _path.resolve(__dirname, imgPath)

      // find files in directory with same key
      for (const folder in backgrounds) {
        let fullPath = _path.resolve(assetsPath, folder)

        if (fs.existsSync(_path.resolve(fullPath))) { // check dir exists
          const image = {}
          fs.readdirSync(fullPath).forEach((file) => {
            const stat = fs.statSync(_path.join(fullPath, file)) // to prevent if directory

            if (stat.isFile() && isImage(file)) {
              let url = _path.join(imgPath, folder, file) // ex: assets/images/textures/file.png
              url = url.replace(/\\/g, '/')
              const name = _path.parse(file).name // remove extension
              image[name] = `url('${url}')`
            }
          })
          backgrounds[folder] = image
        }
      }

      backgrounds['user'] = storageService.getGlobal('userBackgrounds') || {}
      for (let name in backgrounds['user']) {
        const mathPath = backgrounds['user'][name].match(/\((.*)\)/)
        if (mathPath) {
          let filePath = mathPath[1].replace(/'/g, ``)
          let fullPath = _path.join(__dirname, filePath)
          if (!fs.existsSync(filePath) && !fs.existsSync(fullPath)) {
            delete backgrounds['user'][name]
            storageService.setGlobal('userBackgrounds', backgrounds['user'])
          }
        }
      }

      function upload () {
        const options = {
          title: 'Add Image',
          filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
          ],
          properties: ['openFile']
        }

        require('electron').remote.dialog.showOpenDialog(options, (fileName) => {
          if (fileName === undefined) return
          fileName = fileName[0]

          const readStream = fs.createReadStream(fileName)
          readStream.on('readable', () => {
            toastService.success('Background Added Successfully!', 3000)

            const userImages = backgrounds['user']
            let url = fileName
            url = url.replace(/\\/g, '/')
            const name = _path.parse(fileName).name
            userImages[name] = `url('${url}')`

            backgrounds['user'] = userImages
          })
            .on('error', (error) => {
              toastService.error(`Error Adding Background (reading): ${error}`, 3000)
            })
        })
      }

      function deleteImage (evt, image) {
        evt.preventDefault()
        evt.stopPropagation()

        const file = image.substring(5, image.length - 2)

        const name = _path.parse(file).name
        delete backgrounds['user'][name]

        if (image === initialBackground) {
          selectBackground(backgrounds['images']['Ark'])
        } else {
          selectBackground(initialBackground)
        }

        toastService.success('Background Removed Successfully!', 3000)
      }

      function isImage (file) {
        const extension = _path.extname(file)
        if (extension === '.jpg' || extension === '.png' || extension === '.gif') {
          return true
        }
        return false
      }

      function selectTheme (theme) {
        generateDarkTheme(theme)
        $scope.send.selectedTheme = theme
        currentNetwork.theme = theme
        // currentNetwork.themeDark
        setDarkMode()
      }

      function selectBackground (background) {
        $scope.send.selectedBackground = background
        currentNetwork.background = background
      }

      function save () {
        $mdDialog.hide()
        networkService.setNetwork(context, currentNetwork)
        storageService.setGlobal('userBackgrounds', backgrounds['user'])
        window.location.reload()
      }

      function cancel () {
        $mdDialog.hide()
        currentNetwork.background = initialBackground
        currentNetwork.theme = initialTheme
        currentNetwork.themeDark = initialDarkMode
        currentTheme = initialThemeView
      }

      function toggleDark (status) {
        currentNetwork.themeDark = status
        setDarkMode()
      }

      function setDarkMode () {
        if (currentNetwork.themeDark) {
          self.currentTheme = 'dark'
        } else {
          self.currentTheme = currentNetwork.theme
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
        upload: upload,
        deleteImage: deleteImage,
        selectedTab: selectedTab
      }

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/manageBackground.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      })
    }

    function showExchangeRate () {
      return self.network.cmcTicker || self.network.token === 'ARK'
    }

    function manageNetworks () {
      let networks = networkService.getNetworks()

      function save () {
        // these are not needed as the createNetwork now rerender automatically
        $mdDialog.hide()
        for (const network in $scope.send.networks) {
          networkService.setNetwork(network, $scope.send.networks[network])
          self.listNetworks = networkService.getNetworks()
        }
      // window.location.reload()
      }

      function cancel () {
        $mdDialog.hide()
      }

      function refreshTabs () {
        // reload networks
        networks = networkService.getNetworks()
        self.listNetworks = networks
        // add it back to the scope
        $scope.send.networkKeys = Object.keys(networks)
        $scope.send.networks = networks
        // tell angular that the list changed
        $scope.$apply()
      }

      function createNetwork () {
        networkService.createNetwork($scope.send.createnetwork).then(
          (network) => {
            refreshTabs()
          },
          formatAndToastError
        )
      }

      function removeNetwork (network) {
        const confirm = $mdDialog.confirm()
          .title(gettextCatalog.getString('Remove Network') + ' ' + network)
          .theme(self.currentTheme)
          .textContent(gettextCatalog.getString('Are you sure you want to remove this network and all data (accounts and settings) associated with it from your computer. Your accounts are still safe on the blockchain.'))
          .ok(gettextCatalog.getString('Remove from my computer all cached data from this network'))
          .cancel(gettextCatalog.getString('Cancel'))
        $mdDialog.show(confirm).then(() => {
          networkService.removeNetwork(network)
          self.listNetworks = networkService.getNetworks()
          toastService.success('Network removed succesfully!', 3000)
        })
      }

      $scope.send = {
        networkKeys: Object.keys(networks),
        networks: networks,
        createNetwork: createNetwork,
        removeNetwork: removeNetwork,
        cancel: cancel,
        save: save
      }

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/manageNetwork.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope,
        fullscreen: true
      })
    }

    function openPassphrasesDialog (selectedAccount) {
      const passphrases = accountService.getPassphrases(selectedAccount.address)
      const data = { address: selectedAccount.address, passphrase: passphrases[0], secondpassphrase: passphrases[1] }

      function save () {
        $mdDialog.hide()
        accountService.savePassphrases($scope.send.data.address, $scope.send.data.passphrase, $scope.send.data.secondpassphrase).then(
          (account) => {
            toastService.success('Passphrases saved')
          },
          formatAndToastError
        )
      }

      function cancel () {
        $mdDialog.hide()
      }

      $scope.send = {
        data: data,
        cancel: cancel,
        save: save
      }

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/savePassphrases.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      })
    }

    // register as delegate
    function createDelegate (selectedAccount) {
      const passphrases = accountService.getPassphrases(selectedAccount.address)
      const data = {
        ledger: selectedAccount.ledger,
        fromAddress: selectedAccount.address,
        username: '',
        secondSignature: selectedAccount.secondSignature,
        passphrase: passphrases[0] ? passphrases[0] : '',
        secondpassphrase: passphrases[1] ? passphrases[1] : ''
      }

      function next () {
        $mdDialog.hide()

        let delegateName
        try {
          delegateName = accountService.sanitizeDelegateName($scope.createDelegate.data.username)
        } catch (error) {
          return formatAndToastError(error)
        }

        transactionBuilderService.createDelegateCreationTransaction({
          ledger: selectedAccount.ledger,
          publicKey: selectedAccount.publicKey,
          fromAddress: $scope.createDelegate.data.fromAddress,
          username: delegateName,
          masterpassphrase: $scope.createDelegate.data.passphrase,
          secondpassphrase: $scope.createDelegate.data.secondpassphrase
        }).then(
          (transaction) => {
            showValidateTransaction(selectedAccount, transaction)
          },
          formatAndToastError
        )
      }

      function cancel () {
        $mdDialog.hide()
      }

      $scope.createDelegate = {
        data: data,
        cancel: cancel,
        next: next
      }

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/createDelegate.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      })
    }

    // Create a new cold account
    // TODO Used in dashboard navbar and accountBox
    function createAccount () {
      const bip39 = require('bip39')
      const data = { passphrase: bip39.generateMnemonic() }

      function next () {
        if (!$scope.createAccountDialog.data.showRepassphrase) {
          $scope.createAccountDialog.data.repassphrase = $scope.createAccountDialog.data.passphrase
          $scope.createAccountDialog.data.passphrase = ''
          $scope.createAccountDialog.data.showRepassphrase = true
        } else {
          if (!$scope.createAccountForm.$valid) {
            return
          }

          const words = $scope.createAccountDialog.data.repassphrase.split(' ')
          if ($scope.createAccountDialog.data.word3 === words[2] && $scope.createAccountDialog.data.word6 === words[5] && $scope.createAccountDialog.data.word9 === words[8]) {
            accountService.createAccount($scope.createAccountDialog.data.repassphrase).then((account) => {
              self.accounts.push(account)
              toastService.success(
                gettextCatalog.getString('Account successfully created: ') + account.address,
                null,
                true
              )
              selectAccount(account)
            })
            $mdDialog.hide()
          } else {
            $scope.createAccountDialog.data.showWrongRepassphrase = true
          }
        }
      }

      function querySearch (text) { // eslint-disable-line no-unused-vars
        text = text.toLowerCase()
        const filter = self.accounts.filter((account) => {
          return (account.address.toLowerCase().indexOf(text) > -1) || (account.username && (account.username.toLowerCase().indexOf(text) > -1))
        })
        return filter
      }

      function cancel () {
        $mdDialog.hide()
      }

      $scope.createAccountDialog = {
        data: data,
        cancel: cancel,
        next: next
      }

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/createAccount.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      })
    }

    // TODO Used in dashboard navbar and accountBox
    function importAccount () {
      const data = {
        passphrase: ''
      // TODO second passphrase
      // secondpassphrase: ''
      }

      function save () {
        if (!$scope.importAccountForm.$valid) {
          return
        }

        if (!$scope.send.data.customPassphrase && !isBIP39($scope.send.data.passphrase)) {
          toastService.error(
            gettextCatalog.getString('Not valid BIP39 passphrase! Please check all words and spaces.')
            , null
            , true
          )
          return
        }

        accountService.createAccount($scope.send.data.passphrase)
          .then(
            (account) => {
              // Check for already imported account
              for (let i = 0; i < self.accounts.length; i++) {
                if (self.accounts[i].address === account.address) {
                  toastService.error(
                    gettextCatalog.getString('Account was already imported: ') + account.address,
                    null,
                    true
                  )
                  return selectAccount(account)
                }
              }

              self.accounts.push(account)
              toastService.success(
                gettextCatalog.getString('Account successfully imported: ') + account.address,
                null,
                true
              )
              selectAccount(account)
            // TODO save passphrases after we have local encrytion
            },
            formatAndToastError
          )
        $mdDialog.hide()
      }

      function cancel () {
        $mdDialog.hide()
      }

      $scope.send = {
        data: data,
        cancel: cancel,
        save: save
      }

      $mdDialog.show({
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/importAccount.html',
        clickOutsideToClose: false,
        preserveScope: true,
        scope: $scope
      })
    }

    function exportAccount (account) {
      $mdDialog.show({
        templateUrl: './src/accounts/view/exportAccount.html',
        controller: 'ExportAccountController',
        escapeToClose: false,
        locals: {
          account: account,
          theme: self.currentTheme
        }
      })
    }

    // Add a second passphrase to an account
    function createSecondPassphrase (selectedAccount) {
      const bip39 = require('bip39')
      const data = { secondPassphrase: bip39.generateMnemonic() }

      if (selectedAccount.secondSignature) {
        return formatAndToastError(
          gettextCatalog.getString('This account already has a second passphrase: ' + selectedAccount.address)
        )
      }

      function warnAboutSecondPassphraseFee () {
        accountService.getFees(true).then((fees) => {
          const secondPhraseArktoshiVal = fees['secondsignature']
          const secondPhraseArkVal = utilityService.arktoshiToArk(secondPhraseArktoshiVal, true)
          const confirm = $mdDialog.confirm({
            title: gettextCatalog.getString('Second Passphrase') + ' ' + gettextCatalog.getString('Fee') + ' (' + networkService.getNetwork().symbol + ')',
            secondPhraseArkVal: secondPhraseArkVal,
            textContent: gettextCatalog.getString('WARNING! Second passphrase creation costs ' + secondPhraseArkVal + ' ' + networkService.getNetwork().token + '.'),
            ok: gettextCatalog.getString('Continue'),
            cancel: gettextCatalog.getString('Cancel')
          })

          $mdDialog.show(confirm)
            .then(() => {
              $mdDialog.show({
                parent: angular.element(document.getElementById('app')),
                templateUrl: './src/accounts/view/createSecondPassphrase.html',
                clickOutsideToClose: false,
                preserveScope: true,
                scope: $scope
              })
            }, () => {
              cancel()
            }
            )
        }
        )
      }

      warnAboutSecondPassphraseFee()

      function next () {
        if (!$scope.createSecondPassphraseDialog.data.showRepassphrase) {
          $scope.createSecondPassphraseDialog.data.reSecondPassphrase = $scope.createSecondPassphraseDialog.data.secondPassphrase
          $scope.createSecondPassphraseDialog.data.secondPassphrase = ''
          $scope.createSecondPassphraseDialog.data.showRepassphrase = true
        } else if ($scope.createSecondPassphraseDialog.data.reSecondPassphrase !== $scope.createSecondPassphraseDialog.data.secondPassphrase) {
          $scope.createSecondPassphraseDialog.data.showWrongRepassphrase = true
        } else {
          transactionBuilderService.createSecondPassphraseCreationTransaction({
            fromAddress: selectedAccount.address,
            masterpassphrase: $scope.createSecondPassphraseDialog.data.passphrase,
            secondpassphrase: $scope.createSecondPassphraseDialog.data.reSecondPassphrase
          }).then(
            (transaction) => {
              showValidateTransaction(selectedAccount, transaction)
            },
            formatAndToastError
          )
          $mdDialog.hide()
        }
      }

      function cancel () {
        $mdDialog.hide()
      }

      $scope.createSecondPassphraseDialog = {
        data: data,
        cancel: cancel,
        next: next
      }
    }

    function loadSignedMessages () {
      self.selected.signedMessages = storageService.get('signed-' + self.selected.address)
    }

    function showValidateTransaction (selectedAccount, transaction, cb) {
      function saveFile () {
        const fs = require('fs')
        const raw = JSON.stringify(transaction)

        require('electron').remote.dialog.showSaveDialog({
          defaultPath: transaction.id + '.json',
          filters: [{
            extensions: ['json']
          }]
        }, (fileName) => {
          if (fileName === undefined) return

          fs.writeFile(fileName, raw, 'utf8', (err) => {
            if (err) {
              toastService.error(
                gettextCatalog.getString('Failed to save transaction file') + ': ' + err,
                null,
                true
              )
            } else {
              toastService.success(
                gettextCatalog.getString('Transaction file successfully saved in') + ' ' + fileName,
                null,
                true
              )
            }
          })
        })
      }

      function send () {
        $mdDialog.hide()

        transaction = accountService.formatTransaction(transaction, selectedAccount.address)
        transaction.confirmations = 0

        networkService.postTransaction(transaction).then(
          (transaction) => {
            selectedAccount.transactions.unshift(transaction)
            toastService.success(
              gettextCatalog.getString('Transaction') + ' ' + transaction.id + ' ' + gettextCatalog.getString('sent with success!'),
              null,
              true
            )

            if (cb && typeof cb === 'function') {
              cb(transaction)
            }
          },
          formatAndToastError
        )
      }

      function cancel () {
        $mdDialog.hide()
      }

      $scope.validate = {
        saveFile: saveFile,
        send: send,
        cancel: cancel,
        transaction: transaction,
        label: accountService.getTransactionLabel(transaction),
        // to avoid small transaction to be displayed as 1e-8
        humanAmount: utilityService.arktoshiToArk(transaction.amount).toString(),
        totalAmount: utilityService.arktoshiToArk(parseFloat(transaction.amount) + transaction.fee, true).toString()
      }

      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        parent: angular.element(document.getElementById('app')),
        templateUrl: './src/accounts/view/validateTransactionDialog.html',
        clickOutsideToClose: false
      })
    }

    function isBIP39 (mnemonic) {
      const bip39 = require('bip39')
      let valid = bip39.validateMnemonic(mnemonic)
      return valid
    }
  }
})()
