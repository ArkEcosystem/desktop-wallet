import store from '@/store'

describe('ProfileModule', () => {
  it('should getter all profiles', () => {
    expect(store.getters['profile/all']).toBeEmpty()
  })

  it('should fail to create a new profile', () => {
    expect(
      () => store.dispatch('profile/create', { id: 'test' })
    ).toThrow()
  })

  describe('getters > balance', () => {
    const profileId = 'balanceId'
    const profile = { id: profileId }
    const wallets = [
      { id: 'A1', profileId, balance: 1000 },
      { id: 'A2', profileId, balance: 173 },
      { id: 'A3', profileId, balance: 97 },
      { id: 'A4', profileId: 'other', balance: 50000 }
    ]

    beforeEach(() => {
      store.commit('profile/CREATE', profile)
      wallets.forEach(wallet => store.commit('wallet/STORE', wallet))
    })

    afterEach(() => {
      wallets.forEach(wallet => store.commit('wallet/DELETE', wallet))
      store.commit('profile/DELETE', profile.id)
    })

    it('should return the balance of the profile wallets', () => {
      expect(store.getters['profile/balance'](profileId)).toEqual(1270)
    })
  })

  describe('actions > delete', () => {
    const profileId = 'deleteId'
    const profile = { id: profileId }
    const wallets = [
      { id: 'A1', profileId },
      { id: 'A2', profileId },
      { id: 'A3', profileId }
    ]
    const transactions = [
      { id: 'tx1', profileId },
      { id: 'tx2', profileId },
      { id: 'tx3', profileId }
    ]

    beforeEach(() => {
      store.commit('profile/CREATE', profile)
      wallets.forEach(wallet => store.commit('wallet/STORE', wallet))
      transactions.forEach(transaction => store.commit('transaction/STORE', transaction))
    })

    it('should delete the profile', async () => {
      expect(store.getters['profile/all']).toEqual([profile])
      await store.dispatch('profile/delete', { id: profileId })
      expect(store.getters['profile/all']).toBeEmpty()
    })

    it('should delete the wallets of the profile', async () => {
      expect(store.getters['wallet/byProfileId'](profileId)).toIncludeSameMembers(wallets)
      await store.dispatch('profile/delete', { id: profileId })
      expect(store.getters['wallet/byProfileId'](profileId)).toBeEmpty()
    })

    it('should delete the transactions of the profile', async () => {
      expect(store.getters['transaction/byProfileId'](profileId)).toIncludeSameMembers(transactions)
      await store.dispatch('profile/delete', { id: profileId })
      expect(store.getters['transaction/byProfileId'](profileId)).toBeEmpty()
    })
  })
})
