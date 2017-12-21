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
    toastServiceMock,
    utilityService

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
      utilityService = {}

      // provide mocks to angular controller
      $provide.value('$mdDialog', mdDialogMock)
      $provide.value('$mdToast', mdToastMock)
      $provide.value('storageService', storageServiceMock)
      $provide.value('gettextCatalog', getTextCatalogMock)
      $provide.value('accountService', accountServiceMock)
      $provide.value('toastService', toastServiceMock)
      $provide.value('utilityService', utilityService)
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
    let mdDialogShowStub,
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
    let mdDialogShowStub,
      mdDialogHideStub

    beforeEach( () => {
      mdDialogShowStub = sinon.stub(mdDialogMock, 'show')
      mdDialogHideStub = sinon.stub(mdDialogMock, 'hide')
      ctrl.getContacts = sinon.stub().returns([])
      ctrl.showToast = sinon.stub()
})

    context('set up addressbook contact modal', () => {
      it('sets up address book modal', () => {
        ctrl.addAddressbookContact()
        sinon.assert.calledOnce(mdDialogShowStub)

        expect($scope.addAddressbookContact).to.have.all.keys(['add', 'cancel'])
        expect($scope.addAddressbookContact.add).to.be.a('function')
        expect($scope.addAddressbookContact.cancel).to.be.a('function')
      })
    })

    context('adding contact with empty name', () => {
      it('fails to add due to empty name', () => {
        const name = ''
        const address = 'AThTtim37wR11D3hxGVtruS3UQTbsjsW3t'
        ctrl.addAddressbookContact()

        $scope.addAddressbookContact.add(name, address)
        expect(mdDialogShowStub.calledOnce).to.be.true
        expect(ctrl.getContacts.calledOnce).to.be.true
        expect(ctrl.showToast.calledWithMatch('', name)).to.be.true
      })
    })

    context('adding contact with invalid address', () => {
      it('fails to add due to empty name', () => {
        const name = 'test_contact'
        const address = 'test_address'
        ctrl.addAddressbookContact()
        $scope.addAddressbookContact.add(name, address)

        expect(mdDialogShowStub.calledOnce).to.be.true
        expect(ctrl.getContacts.calledOnce).to.be.true
        expect(ctrl.showToast.calledWithMatch('', address)).to.be.true
        expect(ctrl.isAddress(address)).to.be.false
      })
    })

    context('adding contact with unique name and address', () => {
      it('is successful', () => {
          const name = 'test_name'
          const address = 'AThTtim37wR11D3hxGVtruS3UQTbsjsW3t'
          
          ctrl.addAddressbookContact()
          const sizeBefore = Object.keys(ctrl.contacts).length
          $scope.addAddressbookContact.add(name, address)
          const sizeAfter = Object.keys(ctrl.contacts).length

          expect(sizeBefore).to.equal(sizeAfter - 1)
          expect(ctrl.contacts[sizeAfter - 1]).to.eql({ name, address })
      })
    })

    context('adding contact with duplicate name', () => {
      it('fails to add due to duplicate name, nothing else added', () => {
        const name = 'test_name'
        const address1 = 'AThTtim37wR11D3hxGVtruS3UQTbsjsW3t'
        const address2 = 'AaLCSaTzwFhrEwvHtpGEt4peVzB1faAvSc'

        ctrl.addAddressbookContact()
        expect(ctrl.contactExists(name)).to.be.false
        $scope.addAddressbookContact.add(name, address1)
        expect(ctrl.contactExists(name)).to.be.true
        const sizeAfterFirst = Object.keys(ctrl.contacts).length

        ctrl.addAddressbookContact()
        $scope.addAddressbookContact.add(name, address2)
        const sizeAfterSecond = Object.keys(ctrl.contacts).length

        // Should be same since we failed to add
        expect(sizeAfterSecond).to.equal(sizeAfterFirst)
      })
    })

    context('adding contact with duplicate address', () => {
      it('fails to add due to duplicate address, nothing else added', () => {
        const name1 = 'test_name'
        const name2 = 'test_name2'
        const address = 'AThTtim37wR11D3hxGVtruS3UQTbsjsW3t'

        ctrl.addAddressbookContact()
        $scope.addAddressbookContact.add(name1, address)
        const sizeAfterFirst = Object.keys(ctrl.contacts).length

        ctrl.addAddressbookContact()
        $scope.addAddressbookContact.add(name2, address)
        const sizeAfterSecond = Object.keys(ctrl.contacts).length

        expect(ctrl.addressExists(address)).to.be.true

        // Should be same since we failed to add
        expect(sizeAfterSecond).to.equal(sizeAfterFirst)
      })
    })
  })
})
