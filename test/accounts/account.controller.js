'use strict'

/*
 * These mocks and tests would be used for splitting the AccountController into
 * more pieces, such as components and services
 */

describe('AccountController', function () {
  const expect = chai.expect

  let ctrl,
    $scope

  let accountServiceMock,
    networkServiceMock,
    pluginLoaderMock,
    storageServiceMock,
    ledgerServiceMock,
    timeServiceMock,
    toastServiceMock

  let mdThemingProviderMock,
    mdThemingMock

  let mdDialogMock,
    mdToastMock,
    getTextCatalogMock

  const ACCOUNTS = ['userAccount1', 'userAccount2']

  beforeEach(() => {
    module('arkclient.accounts', $provide => {
      accountServiceMock = {
        loadAllAccounts () { return ACCOUNTS },
        getActiveDelegates: angular.noop,
        getDelegateByUsername: angular.noop,
        getFees: sinon.stub().resolves(),
        createTransaction: sinon.stub().resolves()
      }
      networkServiceMock = {
        getLatestClientVersion () { return new Promise((resolve, reject) => resolve('0.0.0')) },
        getNetwork () { return { theme: 'default', themeDark: false } },
        getNetworks () {},
        getConnection () { return new Promise((resolve, reject) => resolve()) }
      }
      pluginLoaderMock = {
        triggerEvent: sinon.stub()
      }
      storageServiceMock = {
        get: sinon.stub().returns(['test_contact']),
        getContext () {}
      }

      ledgerServiceMock = {}
      timeServiceMock = {}
      toastServiceMock = {}

      const themeMock = {
        primaryPalette () { return this },
        accentPalette () { return this },
        warnPalette () { return this },
        backgroundPalette () { return this },
        dark () { return this }
      }

      mdThemingProviderMock = {
        theme () { return themeMock },
        $get () {
          return {
            THEMES: {
              default: { colors: { primary: {}, accent: {}, warn: {}, background: {} } }
            },
            generateTheme () {}
          }
        }
      }

      mdThemingMock = {}

      mdDialogMock = {
        show: angular.noop,
        hide: angular.noop,
        confirm: angular.noop
      }
      mdToastMock = {}
      getTextCatalogMock = {
        getString: sinon.stub().returns('!'),
        setCurrentLanguage: sinon.stub()
      }

      // provide mocks to angular controller
      $provide.value('accountService', accountServiceMock)
      $provide.value('networkService', networkServiceMock)
      $provide.value('pluginLoader', pluginLoaderMock)
      $provide.value('storageService', storageServiceMock)
      $provide.value('ledgerService', ledgerServiceMock)
      $provide.value('timeService', timeServiceMock)
      $provide.value('toastService', toastServiceMock)

      $provide.value('$mdThemingProvider', mdThemingProviderMock)
      $provide.value('$mdTheming', mdThemingMock)

      $provide.value('$mdDialog', mdDialogMock)
      $provide.value('$mdToast', mdToastMock)
      $provide.value('gettextCatalog', getTextCatalogMock)
      $provide.value('ARKTOSHI_UNIT', Math.pow(10, 8))
    })

    inject((_$compile_, _$rootScope_, _$controller_) => {
      $scope = _$rootScope_.$new()
      ctrl = _$controller_('AccountController', { $scope })
    })
  })

  describe('', () => {
    xit('loads all the accounts', function () {
    })
  })

  // Account retreival
  describe('getAllAccounts()', () => {
    beforeEach(function () {
      sinon.stub(ctrl, 'myAccounts').returns(ACCOUNTS)
    })

    context("when there aren't any ledger accounts", () => {
      it('returns the user accounts only', function () {
        expect(ctrl.getAllAccounts()).to.have.same.members(ACCOUNTS)
      })
    })

    context('when there are ledger accounts', () => {
      beforeEach(function () {
        ctrl.ledgerAccounts = ['ledgerAccount1', 'ledgerAccoun2']
      })

      it('returns the user and the ledger accounts', function () {
        expect(ctrl.getAllAccounts()).to.have.members(ACCOUNTS.concat(ctrl.ledgerAccounts))
      })
    })
  })

  // BTC toggle
  describe('test btc toggle', () => {
    context('bitcoinCurrency is valid', () => {
      it('bitcoinCurrency is valid', () => {
        expect(ctrl.bitcoinCurrency).to.not.be.undefined
        expect(ctrl.bitcoinCurrency.name).to.equal('btc')
      })
    })

    context('check', () => {
      beforeEach(() => {
        ctrl.btcValueActive = false
      })

      it('is active', () => {
        ctrl.toggleBitcoinCurrency()
        expect(ctrl.btcValueActive).to.equal(true)
      })

      it('is inactive (off -> on -> off)', () => {
        ctrl.toggleBitcoinCurrency()
        ctrl.toggleBitcoinCurrency()
        expect(ctrl.btcValueActive).to.equal(false)
      })

      it('is active (forced)', () => {
        ctrl.toggleBitcoinCurrency(true)
        expect(ctrl.btcValueActive).to.equal(true)
      })

      it('is inactive (forced)', () => {
        ctrl.toggleBitcoinCurrency(false)
        expect(ctrl.btcValueActive).to.equal(false)
      })
    })
  })

  // Adding Second passphrase test
  describe('adding second passphrase', () => {
    let requireNotMocked = require
    beforeEach( () => {
      require = sinon.stub().returns(require('../node_modules/bip39'))
    })
    afterEach( () => {
      require = requireNotMocked
    })
    context('when the account doesnt have a second passphrase', () => {
      it('sets up second passphrase modal', () => {
        ctrl.createSecondPassphrase(ACCOUNTS[0])
        expect($scope.createSecondPassphraseDialog).to.have.all.keys(['data', 'cancel', 'next'])
        expect($scope.createSecondPassphraseDialog.cancel).to.be.a('function')
        expect($scope.createSecondPassphraseDialog.next).to.be.a('function')

        // Passphrases have 12 words
        const password = $scope.createSecondPassphraseDialog.data.secondPassphrase
        expect(password.trim().split(' ')).to.have.lengthOf(12)
      })
    })
    context('user going through second passphrase add', () => {
      it('inputs wrong passwords', () => {
        ctrl.createSecondPassphrase(ACCOUNTS[0])
        $scope.createSecondPassphraseDialog.next()
        $scope.createSecondPassphraseDialog.data.secondPassphrase = 'not right'
        $scope.createSecondPassphraseDialog.next()
        sinon.assert.match($scope.createSecondPassphraseDialog.data.showWrongRepassphrase, true)
      })
      it('inputs right passwords, should create transaction', () => {
        ctrl.createSecondPassphrase(ACCOUNTS[0])
        $scope.createSecondPassphraseDialog.next()
        $scope.createSecondPassphraseDialog.data.secondPassphrase = $scope.createSecondPassphraseDialog.data.reSecondPassphrase
        $scope.createSecondPassphraseDialog.next()
        sinon.assert.calledOnce(accountServiceMock.createTransaction)
      })
    })
  })
})
