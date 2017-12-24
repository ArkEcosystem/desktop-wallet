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

  const MOCK_NETWORK_SECOND = {
    nethash: 'second_mock_hash',
    peerseed: 'http://5.39.9.240:4001',
    forcepeer: false,
    token: 'ARK-MOCK-2',
    symbol: 'Ѧ-MOCK-2',
    version: 1,
    slip44: 1,
    explorer: 'mock-explorer',
    exchanges: {changer: 'ark_ARK'},
    background: 'url(assets/images/images/Ark.jpg)',
    theme: 'default',
    themeDark: false
  }

  beforeEach(() => {
    module('arkclient.services', function($provide) {
      toastServiceMock = {}
      storageServiceMock = {}
      $provide.value('toastService', toastServiceMock)
    })
    inject($injector => {
      networkService = $injector.get('networkService')
    })
  })

  describe('getConnection', function () {
    it('returns a promise', function () {
      let connection = networkService.getConnection()
      sinon.assert.match(true, typeof connection.then === 'function')
    })
  })
})
