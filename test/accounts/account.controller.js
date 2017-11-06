'use strict'

// const describe = require('mocha').describe

describe('AccountController', function () {
  const expect = chai.expect

  let ctrl,
    $scope

  let accountServiceMock,
    networkServiceMock,
    pluginLoaderMock,
    storageServiceMock,
    changerServiceMock,
    ledgerServiceMock,
    timeServiceMock,
    toastServiceMock

  let mdThemingProviderMock
    , mdThemingMock

  let mdSidenavMock,
    mdBottomSheetMock,
    mdDialogMock,
    mdToastMock,
    getTextCatalogMock

  beforeEach(() => {
    module('arkclient.accounts', ($provide) => {
      accountServiceMock = {}
      networkServiceMock = {}
      pluginLoaderMock = {
        triggerEvent: sinon.stub()
      }
      storageServiceMock = {
        get: sinon.stub().returns(['test_contact'])
      }
      changerServiceMock = {}
      ledgerServiceMock = {}
      timeServiceMock = {}
      toastServiceMock = {}

      mdThemingProviderMock = {}
      mdThemingMock = {}

      mdDialogMock = {}
      mdToastMock = {}
      getTextCatalogMock = {
        getString: sinon.stub(),
        setCurrentLanguage: sinon.stub(),
      }

      // provide mocks to angular controller
      $provide.value('accountService', accountServiceMock)
      $provide.value('networkService', accountServiceMock)
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
    })

    inject( (_$compile_, _$rootScope_, _$controller_) => {
      $scope = _$rootScope_.$new()
      ctrl = _$controller_('AccountController', { $scope: $scope })
    })
  })

  describe('initialized state', () => {
    it('retrieves contacts from storage', () => {
      expect(ctrl.contacts).to.deep.equal(['test_contact'])
      expect(storageServiceMock.get.calledOnce).to.be.true
      expect(storageServiceMock.get.getCall(0).args[0]).to.equal('contacts')
    })
  })

})
