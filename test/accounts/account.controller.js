'use strict'

/*
 * These mocks and tests would be used for splitting the AccountController into
 * more pieces, such as components and services
 */

describe('AccountController', function () {
  const expect = chai.expect

  let ctrl,
    $scope,
	$filter

  let accountServiceMock,
    networkServiceMock,
    pluginLoaderMock,
    storageServiceMock,
    changerServiceMock,
    ledgerServiceMock,
    timeServiceMock,
    toastServiceMock

  let mdThemingProviderMock,
    mdThemingMock

  let mdDialogMock,
    mdToastMock,
    getTextCatalogMock

  const accounts = ['userAccount1', 'userAccount2']

  beforeEach(() => {
    module('arkclient.accounts', $provide => {
      accountServiceMock = {
        loadAllAccounts () { return accounts }
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
        get: sinon.stub()
         .onCall('dateFormat').returns('YMD')
         .returns(['test_contact']),
        getContext () {}
      }
      changerServiceMock = {
        getHistory () {},
        getMarketInfo () { return new Promise((resolve, reject) => resolve()) }
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

      mdDialogMock = {}
      mdToastMock = {}
      getTextCatalogMock = {
        getString: sinon.stub(),
        setCurrentLanguage: sinon.stub()
      }

      // provide mocks to angular controller
      $provide.value('accountService', accountServiceMock)
      $provide.value('networkService', networkServiceMock)
      $provide.value('pluginLoader', pluginLoaderMock)
      $provide.value('storageService', storageServiceMock)
      $provide.value('changerService', changerServiceMock)
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

    inject((_$compile_, _$rootScope_, _$controller_, _$filter_) => {
      $scope = _$rootScope_.$new()
      ctrl = _$controller_('AccountController', { $scope })
	  $filter = _$filter_
    })
  })

  describe('', () => {
    xit('loads all the accounts', function () {
    })
  })

  describe('getAllAccounts()', () => {
    beforeEach(function () {
      sinon.stub(ctrl, 'myAccounts').returns(accounts)
    })

    context("when there aren't any ledger accounts", () => {
      it('returns the user accounts only', function () {
        expect(ctrl.getAllAccounts()).to.have.same.members(accounts)
      })
    })

    context('when there are ledger accounts', () => {
      beforeEach(function () {
        ctrl.ledgerAccounts = ['ledgerAccount1', 'ledgerAccoun2']
      })

      it('returns the user and the ledger accounts', function () {
        expect(ctrl.getAllAccounts()).to.have.members(accounts.concat(ctrl.ledgerAccounts))
      })
    })
  })

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
  
  describe('check formattedDate filter for valid date', () => {
    context('get valid date format for Yead-Date-Month', () => {
		it('testing for formatting a valid date', function () {
          // Arrange.
          var validDate = '2017-12-14T11:49:08.000Z';

          // Act
          result = $filter('formattedDate')(validDate)

          // Assert
          expect(result).to.equal('14/12/2017 7:49 AM');
		})

		
		// var formattedDateText = $filter('formattedDate')('2017-12-14T11:49:08.000Z')
		// expect(formattedDateText).to.equal('14/12/2017 7:49 AM')
		
		// it(''
	})
  })
})
