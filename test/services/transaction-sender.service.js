'use strict'

describe('transactionSenderService', () => {
  describe('openDialogIn()', () => {
    let transactionSenderService

    let accountCtrl,
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
      getTextCatalogMock,
      gettextMock

    const transactionBuilderServiceMock = {
      createSendTransaction: sinon.stub()
    }

    const ACCOUNTS = ['userAccount1', 'userAccount2']

    beforeEach(module('arkclient.constants'))

    beforeEach(() => {
      module('arkclient.accounts', $provide => {
        accountServiceMock = {
          loadAllAccounts () { return ACCOUNTS },
          getActiveDelegates: angular.noop,
          getDelegateByUsername: angular.noop,
          getFees: sinon.stub().resolves(),
          getPassphrases () { return ['pass1'] }
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
        gettextMock = sinon.stub().returnsArg(0)

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
        $provide.value('gettext', gettextMock)
      })

      module('arkclient.services', $provide => {
        $provide.value('transactionBuilderService', transactionBuilderServiceMock)
      })

      inject(($injector, _$rootScope_, _$controller_) => {
        $scope = _$rootScope_.$new()
        accountCtrl = _$controller_('AccountController', { $scope })
        transactionSenderService = $injector.get('transactionSenderService')
      })
    })

    afterEach(() => {
      transactionBuilderServiceMock.createSendTransaction.reset()
    })

    context('single transaction', () => {
      const tab = 'single'

      const fillValidForm = ({ amount }) => {
        $scope[`${tab}Form`] = { $valid: true }
        $scope.data = {
          toAddress: 'A0123',
          passphrase: 'pass1',
          secondPassphrase: 'pass2',
          amount
        }
      }

      context('when the form amount is a float', () => {
        it('uses the right amount to build it', () => {
          transactionBuilderServiceMock.createSendTransaction.resolves({})
          const spy = transactionBuilderServiceMock.createSendTransaction
          const selectedAccount = {}

          transactionSenderService.openDialogIn($scope, accountCtrl, selectedAccount)
          // @see https://github.com/ArkEcosystem/ark-desktop/issues/385
          fillValidForm({ amount: 1.0440473 })
          $scope.submit(tab)
          expect(spy.firstCall.args[0].amount).to.equal(104404730)

          transactionSenderService.openDialogIn($scope, accountCtrl, selectedAccount)
          fillValidForm({ amount: '299.9' })
          $scope.submit(tab)
          expect(spy.secondCall.args[0].amount).to.equal(29990000000)
        })
      })
    })
  })
})
