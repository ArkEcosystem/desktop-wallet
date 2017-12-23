'use strict'

describe('networkService', function () {

  let networkService

  let qMock,
    httpMock,
    timeoutMock,
    storageServiceMock,
    timeServiceMock,
    toastServiceMock

  const MOCK_NETWORK = {
    nethash: 'mock hash',
    peerseed: 'http://5.39.9.240:4001',
    forcepeer: false,
    token: 'ARK-MOCK',
    symbol: 'Ѧ-MOCK',
    version: 1,
    slip44: 1,
    explorer: 'mock-explorer',
    exchanges: {changer: 'ark_ARK'},
    background: 'url(assets/images/images/Ark.jpg)',
    theme: 'default',
    themeDark: false
  }

  beforeEach(() => {
    module('arkclient.services', $provide => {
      qMock = {}
      httpMock = {}
      timeoutMock = {}
      storageServiceMock = {
        get: sinon.stub(),
        getContext: sinon.stub().returns(MOCK_NETWORK),
        getGlobal: sinon.stub()
      }
      timeServiceMock = {}
      toastServiceMock = {}

      $provide.value('$q', qMock)
      $provide.value('$http', httpMock)
      $provide.value('$timeout', timeoutMock)
      $provide.value('storageService', storageServiceMock)
      $provide.value('timeService', timeServiceMock)
      $provide.value('toastService', toastServiceMock)
    })

    inject($injector => {
      networkService = $injector.get('networkService')
    })

  })

  describe('getConnection', function () {
    it('returns a promise', function () {
      networkService.getConnection()
    })
  })

})
