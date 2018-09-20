import store from '@/store'

describe('WalletModule', () => {
  const models = [
    { id: 1, address: 'A1', profileId: 'exampleId' },
    { id: 2, address: 'A2', profileId: 'otherId' },
    { id: 3, address: 'A3', profileId: 'exampleId' }
  ]

  beforeEach(() => {
    models.forEach(model => store.commit('wallet/STORE', model))
  })

  describe('getters all', () => {
    it('should return all wallets', () => {
      expect(store.getters['wallet/all']).toIncludeSameMembers(models)
    })
  })

  describe('getters byAddress', () => {
    describe('when the wallet address param does not exist', () => {
      it('should find and return the wallet', () => {
        expect(store.getters['wallet/byAddress']('AunKno0n')).toBeUndefined()
      })
    })

    describe('when the wallet address param exists', () => {
      it('should find and return the wallet', () => {
        expect(store.getters['wallet/byAddress']('A2')).toEqual(models[1])
      })
    })
  })

  describe('getters byProfileId', () => {
    describe('when the profile does not have any wallet', () => {
      it('should return all wallets of a profile', () => {
        expect(store.getters['wallet/byProfileId']('unknwonId')).toBeEmpty()
      })
    })

    describe('when the profile has wallets', () => {
      it('should return them', () => {
        const walletsOfExampleId = [models[0], models[2]]
        expect(store.getters['wallet/byProfileId']('exampleId')).toIncludeSameMembers(walletsOfExampleId)
      })
    })
  })

  describe('actions', () => {
    it('should fail to create a new wallet', () => {
      expect(
        () => store.dispatch('wallet/create', { id: 'test' })
      ).toThrow()
    })
  })
})
