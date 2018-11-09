'use strict'

/*
 * These mocks and tests would be used for splitting the AccountController into
 * more pieces, such as components and services
 */

describe('AccountController', () => {
  const expect = chai.expect

  let ctrl,
    $scope

  let accountServiceMock,
    networkServiceMock,
    pluginLoaderMock,
    storageServiceMock,
    ledgerServiceMock,
    timeServiceMock,
    toastServiceMock,
    transactionBuilderServiceMock

  let mdThemingProviderMock,
    mdThemingMock

  let mdDialogMock,
    mdToastMock,
    getTextCatalogMock,
    gettextMock

  const ACCOUNTS = ['userAccount1', 'userAccount2']

  beforeEach(module('arkclient.constants'))

  beforeEach(() => {
    module('arkclient.accounts', $provide => {
      accountServiceMock = {
        loadAllAccounts () { return ACCOUNTS },
        getActiveDelegates: angular.noop,
        getDelegateByUsername: angular.noop,
        getFees: sinon.stub().resolves()
      }
      transactionBuilderServiceMock = {
        createSecondPassphraseCreationTransaction: sinon.stub().resolves()
      }
      networkServiceMock = {
        getNetwork () { return { theme: 'default', themeDark: false } },
        getNetworks () {},
        getConnection () { return new Promise((resolve, reject) => resolve()) }
      }
      pluginLoaderMock = {
        triggerEvent: sinon.stub()
      }
      storageServiceMock = {
        get: sinon.stub().returns(['test_contact']),
        getContext () {},
        set () {}
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
      gettextMock = sinon.stub().returnsArg(0)

      // provide mocks to angular controller
      $provide.value('accountService', accountServiceMock)
      $provide.value('transactionBuilderService', transactionBuilderServiceMock)
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
      $provide.value('gettext', gettextMock)
    })

    inject((_$compile_, _$rootScope_, _$controller_) => {
      $scope = _$rootScope_.$new()
      ctrl = _$controller_('AccountController', { $scope })
    })
  })

  describe('', () => {
    xit('loads all the accounts', () => {
    })
  })

  // Account retreival
  describe('getAllAccounts()', () => {
    beforeEach(() => {
      sinon.stub(ctrl, 'myAccounts').returns(ACCOUNTS)
    })

    context("when there aren't any ledger accounts", () => {
      it('returns the user accounts only', () => {
        expect(ctrl.getAllAccounts()).to.have.same.members(ACCOUNTS)
      })
    })

    context('when there are ledger accounts', () => {
      beforeEach(() => {
        ctrl.ledgerAccounts = ['ledgerAccount1', 'ledgerAccoun2']
      })

      it('returns the user and the ledger accounts', () => {
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

  // Select Currency
  describe('test select currency', () => {
    context('currency is valid', () => {
      it('currency is valid', () => {
        expect(ctrl.currency).to.not.be.undefined
        expect(ctrl.currencies).to.not.be.undefined
      })
    })

    context('click', () => {
      beforeEach(() => {
        ctrl.currency = ctrl.currencies[0]
      })

      it('no shift', () => {
        ctrl.selectCurrency({ shiftKey: false })
        expect(ctrl.currency).to.equal(ctrl.currencies[1])
      })

      it('shift', () => {
        ctrl.selectCurrency({ shiftKey: true })
        expect(ctrl.currency).to.equal(ctrl.currencies[ctrl.currencies.length - 1])
      })

      it('no shift then shift', () => {
        let startCurrency = ctrl.currency
        ctrl.selectCurrency({ shiftKey: false })
        expect(ctrl.currency).to.not.equal(startCurrency)
        ctrl.selectCurrency({ shiftKey: true })
        expect(ctrl.currency).to.equal(startCurrency)
      })

      it('shift then no shift', () => {
        let startCurrency = ctrl.currency
        ctrl.selectCurrency({ shiftKey: true })
        expect(ctrl.currency).to.not.equal(startCurrency)
        ctrl.selectCurrency({ shiftKey: false })
        expect(ctrl.currency).to.equal(startCurrency)
      })
    })
  })

  // Adding Second passphrase test
  describe('adding second passphrase', () => {
    let requireNotMocked = require
    beforeEach(() => {
      require = sinon.stub().returns(require(require('path').resolve(__dirname, '../node_modules/bip39')))
    })
    afterEach(() => {
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
        sinon.assert.calledOnce(transactionBuilderServiceMock.createSecondPassphraseCreationTransaction)
      })
    })
  })
})
