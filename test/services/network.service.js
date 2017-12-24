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

  const MOCK_MAINNET_NAME = {
      name: 'mainnet'
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

  describe('getConnection', () => {
    it('returns a promise', () =>  {
      let connection = networkService.getConnection()
      sinon.assert.match(true, typeof connection.then === 'function')
    })
  })

  describe('createNetwork', () => {
    context('name already taken', () => {
      it('should give rejection', () => {
        let answer = networkService.createNetwork(MOCK_MAINNET_NAME)
        const REJECTED_PROMISE = 2
        sinon.assert.match(answer.$$state.status, REJECTED_PROMISE)
      })
    })
  })
})
