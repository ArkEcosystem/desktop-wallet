import store from '@/store'

describe('TransactionModule', () => {
  const models = [
    { id: 0, recipient: 'A0', sender: 'A4', profileId: 'otherId' },
    { id: 1, recipient: 'A1', sender: 'A2', profileId: 'exampleId' },
    { id: 3, recipient: 'A3', sender: 'A2', profileId: 'otherId' },
    { id: 4, recipient: 'A3', sender: 'A3', profileId: 'exampleId' },
    { id: 5, recipient: 'A4', sender: 'A3', profileId: 'exampleId' },
    { id: 6, recipient: 'A5', sender: 'A1', profileId: 'exampleId' }
  ]

  beforeEach(() => {
    store.commit('session/SET_PROFILE_ID', 'exampleId')
    models.forEach(model => store.commit('transaction/STORE', model))
  })

  describe('getters byAddress', () => {
    describe('when the address param does not exist', () => {
      it('should return an empty `Array`', () => {
        expect(store.getters['transaction/byAddress']('AunKno0n')).toBeEmpty()
      })
    })

    describe('when the address is used as recipient', () => {
      it('should find and return the transactions of the current profile', () => {
        expect(store.getters['transaction/byAddress']('A4')).toEqual([
          models[4]
        ])
      })
    })

    describe('when the address is used as sender', () => {
      it('should find and return the transactions of the current profile', () => {
        expect(store.getters['transaction/byAddress']('A2')).toIncludeSameMembers([
          models[1]
        ])
      })
    })

    describe('when the address is used as recipient and sender', () => {
      it('should find and return the transactions of the current profile', () => {
        expect(store.getters['transaction/byAddress']('A3')).toIncludeSameMembers([
          models[3],
          models[4]
        ])
      })
    })
  })

  describe('getters byProfileId', () => {
    describe('when the profile does not have any transaction', () => {
      it('should return an empty `Array`', () => {
        expect(store.getters['transaction/byProfileId']('unknownId')).toBeEmpty()
      })
    })

    describe('when the profile has transactions', () => {
      it('should return them, without transactions from other profiles', () => {
        expect(store.getters['transaction/byProfileId']('exampleId')).toIncludeSameMembers([
          models[1],
          models[3],
          models[4],
          models[5]
        ])
      })
    })
  })
})
