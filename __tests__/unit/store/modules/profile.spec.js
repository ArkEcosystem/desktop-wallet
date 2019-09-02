import store from '@/store'
import BigNumber from '@/plugins/bignumber'

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
      const balance = store.getters['profile/balance'](profileId)
      expect(balance).toBeInstanceOf(BigNumber)
      expect(balance.toString()).toEqual('1270')
    })
  })

  describe('getters > balanceWithLedger', () => {
    const networks = [
      { id: 'main', symbol: 'm', token: 'MAI', subunit: 'mainito', fractionDigits: 8 },
      { id: 'other', symbol: 'o', token: 'OTH', subunit: 'another', fractionDigits: 8 }
    ]
    const profileId = 'balanceId'
    const profile = { id: profileId, networkId: networks[0].id }

    let wallets
    let ledgerWallets

    beforeEach(() => {
      wallets = [
        { id: 'A1', address: 'A1', profileId, balance: 1000 },
        { id: 'A2', address: 'A2', profileId, balance: 173 },
        { id: 'A3', address: 'A3', profileId, balance: 97 },
        { id: 'A4', address: 'A4', profileId: 'other', balance: 50000 }
      ]
      ledgerWallets = [
        { id: 'AxLedger1', address: 'AxLedger1', balance: 1330 },
        { id: 'AxLedger2', address: 'AxLedger2', balance: 301 }
      ]

      store.commit('network/SET_ALL', networks)
      store.commit('profile/CREATE', profile)
      wallets.forEach(wallet => store.commit('wallet/STORE', wallet))
      store.commit('session/SET_PROFILE_ID', profileId)
    })

    afterEach(() => {
      wallets.forEach(wallet => store.commit('wallet/DELETE', wallet))
      store.commit('profile/DELETE', profile.id)
    })

    describe('when the Ledger does not have wallets', () => {
      beforeEach(() => {
        store.commit('ledger/SET_WALLETS', [])
      })

      it('should return the balance of the profile wallets only', () => {
        const balance = store.getters['profile/balanceWithLedger'](profileId)
        expect(balance).toBeInstanceOf(BigNumber)
        expect(balance.toString()).toEqual('1270')
      })
    })

    describe('when the Ledger has wallets on the current network', () => {
      beforeEach(() => {
        store.commit('ledger/SET_WALLETS', ledgerWallets)
      })

      it('should return the balance of the profile wallets and the Ledger wallets', () => {
        const balance = store.getters['profile/balanceWithLedger'](profileId)
        expect(balance).toBeInstanceOf(BigNumber)
        expect(balance.toString()).toEqual('2901')
      })

      describe('when those wallets are already included in the profile', () => {
        beforeEach(() => {
          ledgerWallets[0] = wallets[0]
          store.commit('ledger/SET_WALLETS', ledgerWallets)
        })

        it('should ignore them', () => {
          const balance = store.getters['profile/balanceWithLedger'](profileId)
          expect(balance).toBeInstanceOf(BigNumber)
          expect(balance.toString()).toEqual('1571')
        })
      })
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
