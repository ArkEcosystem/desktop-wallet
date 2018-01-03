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
    ledgerServiceMock,
    timeServiceMock,
    toastServiceMock,
    transactionBuilderServiceMock

  let mdThemingProviderMock,
    mdThemingMock

  let mdDialogMock,
    mdToastMock,
    getTextCatalogMock

  const ACCOUNTS = ['userAccount1', 'userAccount2']
  const MOCK_DELEGATE = {
    address: 'mockDelegateArkAddress',
    approval: 89.09,
    missedblocks: 9760,
    producedblocks: 35226,
    productivity: 78.3,
    publicKey: 'mockDelegatePublicKey',
    rate: 1,
    username: 'mock_delegate',
    vote: '11512779451283196'
  }
  const MOCK_DELEGATES = [MOCK_DELEGATE]
  const MOCK_ACCOUNT_OBJ = {
    address: 'mockArkAddress',
    balance: '50000000000',
    delegate: null,
    ledger: null,
    publicKey: 'mockPublicKey',
    secondSignature: 0,
    selectedVotes: [],
    transactions: [],
    virtual: {
      getFolders: angular.noop,
      uservalue: angular.noop
    }
  }

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
        getLatestClientVersion () { return new Promise((resolve, reject) => resolve('0.0.0')) },
        getNetwork () { return { theme: 'default', themeDark: false } },
        getNetworks () {},
        getConnection () { return new Promise((resolve, reject) => resolve()) }
      }
      pluginLoaderMock = {
        triggerEvent: sinon.stub()
      }
      storageServiceMock = {
        get: function() {
          var callback = sinon.stub()
          callback.withArgs('dateFormat').returns('MDY')
          callback.returns(['test_contact'])
		},
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

  // Account retrieval
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

  // Delegate
  describe('addDelegate', () => {
    let getDelegatesStub,
    getDelegateStub,
    mdDialogShowStub,
    mdDialogHideStub

    beforeEach( () => {
      getDelegatesStub = sinon.stub(accountServiceMock, 'getActiveDelegates').resolves(MOCK_DELEGATES)
      getDelegateStub = sinon.stub(accountServiceMock, 'getDelegateByUsername').resolves(MOCK_DELEGATE)

      mdDialogShowStub = sinon.stub(mdDialogMock, 'show')
      mdDialogHideStub = sinon.stub(mdDialogMock, 'hide')

      ctrl.selected = {
        selectedVotes: []
      }
    })

    context('when the selectedAccount is valid', () => {
      it('should fetch active delegates and open the add delegates modal', () => {
        ctrl.addDelegate(MOCK_ACCOUNT_OBJ)

        sinon.assert.calledOnce(getDelegatesStub)
        sinon.assert.calledOnce(mdDialogShowStub)
      })

      it('should set up the delegate modal scope', () => {
        ctrl.addDelegate(MOCK_ACCOUNT_OBJ)

        expect($scope.addDelegateDialog).to.have.all.keys(['data', 'add', 'cancel'])
        expect($scope.addDelegateDialog.add).to.be.a('function')
        expect($scope.addDelegateDialog.cancel).to.be.a('function')
        expect($scope.addDelegateDialog.data).to.have.property('fromAddress', MOCK_ACCOUNT_OBJ.address)
      })
    })

    context('when a delegate is added', () => {
      it('should fetch the delegate to be added and close the modal', () => {
        ctrl.addDelegate(MOCK_ACCOUNT_OBJ)
        $scope.addDelegateDialog.data.delegatename = 'foo'
        $scope.addDelegateDialog.add()

        sinon.assert.calledWith(getDelegateStub, $scope.addDelegateDialog.data.delegatename)
        sinon.assert.calledOnce(mdDialogHideStub)
      })

      it('should add to the delegates list if no delegates have been added', (done) => {
        let acct_obj = angular.copy(MOCK_ACCOUNT_OBJ)
        ctrl.addDelegate(acct_obj)
        $scope.addDelegateDialog.add()

        getDelegateStub().then(res => {
          expect(acct_obj.selectedVotes.length).to.equal(1)
          expect(acct_obj.selectedVotes[0].username).to.equal(MOCK_DELEGATE.username)
          done()
        })
      })

      it('should not add the a duplicate delegate if that delegate is already selected', () => {
        let acct_obj = angular.copy(MOCK_ACCOUNT_OBJ)
        acct_obj.selectedVotes = [angular.copy(MOCK_DELEGATE)]

        ctrl.addDelegate(acct_obj)
        $scope.addDelegateDialog.add(MOCK_DELEGATE.username)

        getDelegateStub().then(res => {

          // Should still only equal 1
          expect(acct_obj.selectedVotes.length).to.eql(1)
          done()
        })
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

  describe('formattedDate filter', () => {
    context('get date formatted as Year-Month-Day', () => {
      it('testing for formatting a valid date', () => {
            var validDate = '2017-12-14T11:49:08.000Z'
            var result = $filter('formattedDate')(validDate)
            expect(result).to.include('2017/12/')
      })
    })
  })

  // Adding Second passphrase test
  describe('adding second passphrase', () => {
    let requireNotMocked = require
    beforeEach( () => {
      require = sinon.stub().returns(require(require('path').resolve(__dirname, '../node_modules/bip39')))
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
        sinon.assert.calledOnce(transactionBuilderServiceMock.createSecondPassphraseCreationTransaction)
      })
    })
  })
})


