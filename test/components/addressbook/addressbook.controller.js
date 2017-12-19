'use strict'

describe('AddressbookController', function () {
  const expect = chai.expect

  let ctrl,
    $scope

  let mdDialogMock,
    mdToastMock,
    storageServiceMock,
    getTextCatalogMock,
    accountServiceMock,
    toastServiceMock

  beforeEach(() => {
    module('arkclient.components', $provide => {
      // define mocked services and stubbed calls
      mdDialogMock = {
        show: angular.noop,
        hide: angular.noop
      }
      mdToastMock = {}
      storageServiceMock = {
        get: sinon.stub().returns(['test_contact'])
      }
      getTextCatalogMock = {
        getString: sinon.stub(),
        setCurrentLanguage: sinon.stub(),
        setStrings: sinon.stub()
      }
      accountServiceMock = {}
      toastServiceMock = {
        error: sinon.stub(),
        success: sinon.stub()
      }

      // provide mocks to angular controller
      $provide.value('$mdDialog', mdDialogMock)
      $provide.value('$mdToast', mdToastMock)
      $provide.value('storageService', storageServiceMock)
      $provide.value('gettextCatalog', getTextCatalogMock)
      $provide.value('accountService', accountServiceMock)
      $provide.value('toastService', toastServiceMock)
      $provide.value('ARKTOSHI_UNIT', Math.pow(10,8))
    })

    inject((_$compile_, _$rootScope_, _$controller_) => {
      $scope = _$rootScope_.$new()
      ctrl = _$controller_('AddressbookController', { $scope })
    })
  })

  describe('initialized state', () => {
    it('retrieves contacts from storage', () => {
      expect(ctrl.contacts).to.deep.equal(['test_contact'])
      expect(storageServiceMock.get.calledOnce).to.be.true
      expect(storageServiceMock.get.getCall(0).args[0]).to.equal('contacts')
    })
  })

  describe('getContacts', () => {
    var mdDialogShowStub,
    mdDialogHideStub

    beforeEach( () => {
      mdDialogShowStub = sinon.stub(mdDialogMock, 'show')
      mdDialogHideStub = sinon.stub(mdDialogMock, 'hide')
    })

    context('when contacts are valid', () => {
      beforeEach(function () {
        storageServiceMock.get = sinon.stub().returns(['valid_contact'])
      })

      it('sets controller contacts to valid return value', () => {
        ctrl.getContacts()

        expect(storageServiceMock.get.calledOnce).to.be.true
        expect(ctrl.contacts).to.deep.equal(['valid_contact'])
      })
    })

    context("when contacts aren't valid", () => {
      beforeEach(function () {
        storageServiceMock.get = sinon.stub().returns(null)
      })
      it('sets controller contacts to empty array on invalid return value', () => {
        ctrl.getContacts()

        expect(storageServiceMock.get.calledOnce).to.be.true
        expect(ctrl.contacts).to.deep.equal([])
      })
    })

    context("set up addressbook contact modal", () => {
      it('sets up address book modal', () => {
        ctrl.addAddressbookContact()
        sinon.assert.calledOnce(mdDialogShowStub)
        expect($scope.addAddressbookContact).to.have.all.keys(['add', 'cancel'])
        expect(typeof $scope.addAddressbookContact.add).to.equal('function')
        expect(typeof $scope.addAddressbookContact.cancel).to.equal('function')
      })
    })

    context("Adding contacts", () => {
      beforeEach(function () {
        ctrl.getContacts = sinon.stub().returns([])
        ctrl.showToast = sinon.stub()
        ctrl.isAddress = sinon.stub()
      })
      it('should fail to add due to empty name', () => {
        let name = ''
        let address = 'a'
        ctrl.addAddressbookContact()
        const retVal = $scope.addAddressbookContact.add(name, address)
        sinon.assert.calledOnce(mdDialogShowStub)
        sinon.assert.match(retVal, undefined)
        sinon.assert.calledOnce(ctrl.getContacts)
        sinon.assert.match(ctrl.trim(name), '')
        sinon.assert.calledWith(ctrl.showToast, 'This Contact Name is not valid', '', true)
        sinon.assert.notCalled(ctrl.isAddress)
      })
    })
  })
})
