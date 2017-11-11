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
    module('arkclient.components', ($provide) => {
      // define mocked services and stubbed calls
      mdDialogMock = {}
      mdToastMock = {}
      storageServiceMock = {
        get: sinon.stub().returns(['test_contact'])
      }
      getTextCatalogMock = {
        setStrings() {}
      }
      accountServiceMock = {}
      toastServiceMock = {}

      // provide mocks to angular controller
      $provide.value('$mdDialog', mdDialogMock)
      $provide.value('$mdToast', mdToastMock)
      $provide.value('storageService', storageServiceMock)
      $provide.value('gettextCatalog', getTextCatalogMock)
      $provide.value('accountService', accountServiceMock)
      $provide.value('toastService', toastServiceMock)
    })

    inject( (_$compile_, _$rootScope_, _$controller_) => {
      $scope = _$rootScope_.$new()
      ctrl = _$controller_('AddressbookController', { $scope: $scope })
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
  })
})
