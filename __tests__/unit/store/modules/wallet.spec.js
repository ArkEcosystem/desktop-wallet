import store from '@/store'

describe('WalletModule', () => {
  const models = [
    { id: 1, address: 'A1', profileId: 'exampleId', name: 'name1' },
    { id: 2, address: 'A2', profileId: 'otherId', name: 'name2' },
    { id: 3, address: 'A3', profileId: 'otherId', name: 'name3' },
    { id: 4, address: 'A3', profileId: 'exampleId', name: 'name4' },
    { id: 5, address: 'A4', profileId: 'exampleId', name: 'name5', isContact: true },
    { id: 6, address: 'A5', profileId: 'exampleId', name: 'name6', isContact: true }
  ]

  const messages = [
    { message: 'hello 1', timestamp: (new Date()).getTime() },
    { message: 'hello 2', timestamp: (new Date()).getTime() + 10 }
  ]

  store.commit('session/SET_PROFILE_ID', 'exampleId')

  beforeEach(() => {
    models.forEach(model => store.commit('wallet/STORE', model))
    messages.forEach(message => store.commit('wallet/DELETE_SIGNED_MESSAGE', message))
  })

  describe('getters byAddress', () => {
    describe('when the wallet address param does not exist', () => {
      it('should return `undefined`', () => {
        expect(store.getters['wallet/byAddress']('AunKno0n')).toBeUndefined()
      })
    })

    describe('when the wallet address param exists', () => {
      it('should find and return the wallet', () => {
        expect(store.getters['wallet/byAddress']('A1')).toEqual(models[0])
      })
    })

    describe('when the wallet is a contact', () => {
      it('should find and return the wallet', () => {
        expect(store.getters['wallet/byAddress']('A4')).toEqual(models[4])
      })
    })
  })

  describe('getters byName', () => {
    describe('when the wallet name param does not exist', () => {
      it('should return `undefined`', () => {
        expect(store.getters['wallet/byName']('not a name')).toBeUndefined()
      })
    })

    describe('when the wallet name param exists', () => {
      it('should find and return the wallet', () => {
        expect(store.getters['wallet/byName']('name1')).toEqual(models[0])
      })
    })

    describe('when the wallet is a contact', () => {
      it('should find and return the wallet', () => {
        expect(store.getters['wallet/byName']('name5')).toEqual(models[4])
      })
    })
  })

  describe('getters byProfileId', () => {
    describe('when the profile does not have any wallet', () => {
      it('should return an empty `Array`', () => {
        expect(store.getters['wallet/byProfileId']('unknownId')).toBeEmpty()
      })
    })

    describe('when the profile has wallets', () => {
      it('should return them', () => {
        const walletsOfExampleId = [models[0], models[3]]
        const contactWalletsOfExampleId = [models[4], models[5]]
        expect(store.getters['wallet/byProfileId']('exampleId')).toIncludeSameMembers(walletsOfExampleId)
        expect(store.getters['wallet/byProfileId']('exampleId')).not.toIncludeSameMembers(contactWalletsOfExampleId)
      })
    })

    describe('wallet should can be on multiple profiles', () => {
      it('should get them individually', () => {
        expect(store.getters['wallet/byProfileId']('exampleId')).toIncludeSameMembers([models[0], models[3]])
        expect(store.getters['wallet/byProfileId']('otherId')).toIncludeSameMembers([models[1], models[2]])
      })
    })
  })

  describe('getters contactsByProfileId', () => {
    describe('when the profile does not have any wallet', () => {
      it('should return an empty `Array`', () => {
        expect(store.getters['wallet/contactsByProfileId']('unknownId')).toBeEmpty()
      })
    })

    describe('when the profile has wallets', () => {
      it('should return them', () => {
        const contactWalletsOfExampleId = [models[4], models[5]]
        const walletsOfExampleId = [models[0], models[3]]
        expect(store.getters['wallet/contactsByProfileId']('exampleId')).toIncludeSameMembers(contactWalletsOfExampleId)
        expect(store.getters['wallet/contactsByProfileId']('exampleId')).not.toIncludeSameMembers(walletsOfExampleId)
      })
    })
  })

  describe('Signed Messages', () => {
    it('should add a signed message', () => {
      store.dispatch('wallet/addSignedMessage', messages[0])
      expect(store.getters['wallet/signedMessages']()).toIncludeSameMembers([messages[0]])
    })

    it('should delete a signed message', () => {
      store.dispatch('wallet/addSignedMessage', messages[0])
      store.dispatch('wallet/addSignedMessage', messages[1])
      store.dispatch('wallet/deleteSignedMessage', messages[0])
      expect(store.getters['wallet/signedMessages']()).toEqual([messages[1]])
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
