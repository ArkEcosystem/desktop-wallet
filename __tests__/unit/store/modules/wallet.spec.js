import store from '@/store'

describe('WalletModule', () => {
  const models = [
    { id: 1, address: 'A1', profileId: 'exampleId' },
    { id: 2, address: 'A2', profileId: 'otherId' },
    { id: 3, address: 'A3', profileId: 'exampleId' },
    { id: 4, address: 'A4', profileId: 'exampleId', isContact: true },
    { id: 5, address: 'A5', profileId: 'exampleId', isContact: true }
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

    describe('when the wallet is a contact', () => {
      it('should find and return the wallet', () => {
        expect(store.getters['wallet/byAddress']('A4')).toEqual(models[3])
      })
    })
  })

  describe('getters byProfileId', () => {
    describe('when the profile does not have any wallet', () => {
      it('should return all wallets of a profile', () => {
        expect(store.getters['wallet/byProfileId']('unknownId')).toBeEmpty()
      })
    })

    describe('when the profile has wallets', () => {
      it('should return them', () => {
        const walletsOfExampleId = [models[0], models[2]]
        const contactWalletsOfExampleId = [models[3], models[4]]
        expect(store.getters['wallet/byProfileId']('exampleId')).toIncludeSameMembers(walletsOfExampleId)
        expect(store.getters['wallet/byProfileId']('exampleId')).not.toIncludeSameMembers(contactWalletsOfExampleId)
      })
    })
  })

  describe('getters contactsByProfileId', () => {
    describe('when the profile does not have any wallet', () => {
      it('should return all wallets of a profile', () => {
        expect(store.getters['wallet/contactsByProfileId']('unknownId')).toBeEmpty()
      })
    })

    describe('when the profile has wallets', () => {
      it('should return them', () => {
        const contactWalletsOfExampleId = [models[3], models[4]]
        const walletsOfExampleId = [models[0], models[2]]
        expect(store.getters['wallet/contactsByProfileId']('exampleId')).toIncludeSameMembers(contactWalletsOfExampleId)
        expect(store.getters['wallet/contactsByProfileId']('exampleId')).not.toIncludeSameMembers(walletsOfExampleId)
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
