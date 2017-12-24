'use strict'

describe('networkService', function () {
  let networkService

  let toastServiceMock

  const MOCK_NETWORK = {
    name: 'test-network',
    peerseed: 'fake'
  }

  const MOCK_MAINNET_NAME = {
      name: 'mainnet'
  }

  beforeEach(() => {
    module('arkclient.services', function($provide) {
      toastServiceMock = {}
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
