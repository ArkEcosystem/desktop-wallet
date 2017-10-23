'use strict'

describe('AddressbookController', function() {

  let app = null
    , $compile = null
    , $rootScope = null
    , $scope = null

  beforeEach(module('arkclient.components'))

  beforeEach( ()=> {
    inject( (_$compile_, _$rootScope_)=> {
      $compile = _$compile_
      $rootScope = _$rootScope_
      $scope = _$rootScope_.$new()
    })
  })

  describe('getContacts', function() {
    it('loads the contacts')
  })

})
