'use strict'

describe('AddressbookController', function() {
  const expect = chai.expect;

  let ctrl,
    $compile, 
    $rootScope, 
    $scope;

  let mdDialogMock,
    mdToastMock,
    storageServiceMock,
    getTextCatalogMock,
    accountServiceMock;

  beforeEach(() => {
    module('arkclient.components', ($provide) => {
      // define mocked services and stubbed calls
      mdDialogMock = {};
      mdToastMock = {};
      storageServiceMock = {
        get: sinon.stub().returns(['test_contact'])
      };
      getTextCatalogMock = {};
      accountServiceMock = {};

      // provide mocks to angular controller
      $provide.value('$mdDialog', mdDialogMock);
      $provide.value('$mdToast', mdToastMock);
      $provide.value('storageService', storageServiceMock);
      $provide.value('gettextCatalog', getTextCatalogMock);
      $provide.value('accountService', accountServiceMock);
    });

    inject( (_$compile_, _$rootScope_, _$controller_)=> {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      ctrl = _$controller_('AddressbookController', {$scope:$scope});
    })
  });

  describe('initialized state', () => {
    it('retrieves contacts from storage', () => {
      //assert
      expect(ctrl.contacts).to.deep.equal(['test_contact']);
      expect(storageServiceMock.get.calledOnce).to.be.true;
      expect(storageServiceMock.get.getCall(0).args[0]).to.equal('contacts');
    });
  });

  describe('getContacts', () => {
    it('sets controller contacts to valid return value', () => {
      //arrange
      storageServiceMock.get = sinon.stub().returns(['valid_contact']);

      //act
      ctrl.getContacts();

      //assert
      expect(storageServiceMock.get.calledOnce).to.be.true;
      expect(ctrl.contacts).to.deep.equal(['valid_contact']);
    });

    it('sets controller contacts to empty array on invalid return value', () => {
      //arrange
      storageServiceMock.get = sinon.stub().returns(null);

      //act
      ctrl.getContacts();

      //assert
      expect(storageServiceMock.get.calledOnce).to.be.true;
      expect(ctrl.contacts).to.deep.equal([]);
    });
  });
});
