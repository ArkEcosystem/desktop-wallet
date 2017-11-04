'use strict'

describe('AddressbookController', function() {

  let app = null,
    ctrl = null,
    $compile = null, 
    $rootScope = null, 
    $scope = null;

  beforeEach(() => {
    module('arkclient.components', ($provide) => {
      let mdDialogStub = {},
        mdToastStub = {},
        storageServiceStub = {
          get: (x) => 'test_contact'
        },
        getTextCatalogStub = {},
        accountServiceStub = {};

      // provide the mock
      // $provide.value('$scope')
      $provide.value('$mdDialog', mdDialogStub);
      $provide.value('$mdToast', mdToastStub);
      $provide.value('storageService', storageServiceStub);
      $provide.value('gettextCatalog', getTextCatalogStub);
      $provide.value('accountService', accountServiceStub);
    });

    inject( (_$compile_, _$rootScope_, _$controller_)=> {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      ctrl = _$controller_('AddressbookController', {$scope:$scope});
    })
  });

  describe('getContacts', function() {
    it('loads the contacts', () => {
      ctrl.getContacts();
    });
  })

})
