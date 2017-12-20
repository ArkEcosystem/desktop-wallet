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
        get: sinon.stub().returns([{name:'test_contact', address: 'test_address'}]),
        set: sinon.stub()
      }
      getTextCatalogMock = {
        getString: sinon.stub(),
        setCurrentLanguage: sinon.stub(),
        setStrings: sinon.stub()
      }
      accountServiceMock = {
        loadAllAccounts: sinon.stub().returns([])
      }
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
      expect(ctrl.contacts).to.deep.equal([{name:'test_contact', address: 'test_address'}])
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
  })

  describe('addAddressbookContact', () =>  {
    var mdDialogShowStub,
    mdDialogHideStub

    beforeEach( () => {
      mdDialogShowStub = sinon.stub(mdDialogMock, 'show')
      mdDialogHideStub = sinon.stub(mdDialogMock, 'hide')
      ctrl.getContacts = sinon.stub().returns([])
      ctrl.showToast = sinon.stub()
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

    context("Adding Contact with empty name", () => {
      it('should fail to add due to empty name', () => {
        let name = ''
        let address = 'a'
        ctrl.addAddressbookContact()
        $scope.addAddressbookContact.add(name, address)
        sinon.assert.calledOnce(mdDialogShowStub)
        sinon.assert.calledOnce(ctrl.getContacts)
        sinon.assert.calledWithMatch(ctrl.showToast, '', name, true)
      })
    })

    context("Adding Contact with invalid address", () => {
      it('should fail to add due to empty name', () => {
        let name = 'test_contact'
        let address = 'test_address'
        ctrl.addAddressbookContact()
        $scope.addAddressbookContact.add(name, address)
        sinon.assert.calledOnce(mdDialogShowStub)
        sinon.assert.calledOnce(ctrl.getContacts)
        sinon.assert.calledWithMatch(ctrl.showToast, '', address, true)
        sinon.assert.match(ctrl.isAddress(address), false)
      })
    })

    context("Adding contact with duplicate name", () => {
      it('should fail to add due to duplicate name, nothing else added', () => {
        const NAME = 'test_name'
        let address = 'AThTtim37wR11D3hxGVtruS3UQTbsjsW3t'

        ctrl.addAddressbookContact()
        sinon.assert.match(ctrl.contactExists(NAME), false)
        $scope.addAddressbookContact.add(NAME, address)
        const SIZE_AFTER_FIRST_ADD = Object.keys(ctrl.contacts).length

        address = 'AaLCSaTzwFhrEwvHtpGEt4peVzB1faAvSc'
        ctrl.addAddressbookContact()
        $scope.addAddressbookContact.add(NAME, address)
        sinon.assert.match(ctrl.contactExists(NAME), true)
        const SIZE_AFTER_SECOND_ADD = Object.keys(ctrl.contacts).length

        //should be same since we failed to add
        sinon.assert.match(SIZE_AFTER_SECOND_ADD, SIZE_AFTER_FIRST_ADD)
      })
    })

    context("Adding contact with duplicate address", () => {
      it('should fail to add due to duplicate address, nothing else added', () => {
        let name = 'test_name'
        const ADDRESS = 'AThTtim37wR11D3hxGVtruS3UQTbsjsW3t'

        ctrl.addAddressbookContact()
        $scope.addAddressbookContact.add(name, ADDRESS)
        const SIZE_AFTER_FIRST_ADD = Object.keys(ctrl.contacts).length
        name = 'test_name2'
        ctrl.addAddressbookContact()
        $scope.addAddressbookContact.add(name, ADDRESS)
        sinon.assert.match(ctrl.addressExists(ADDRESS), true)
        const SIZE_AFTER_SECOND_ADD = Object.keys(ctrl.contacts).length

        //should be same since we failed to add
        sinon.assert.match(SIZE_AFTER_SECOND_ADD, SIZE_AFTER_FIRST_ADD)
      })
    })
  })
})
