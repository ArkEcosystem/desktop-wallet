import nock from 'nock'
import Vue from 'vue'
import Vuex from 'vuex'
import apiClient, { client as ClientService } from '@/plugins/api-client'
import store from '@/store'
import dayjs from 'dayjs'
import { network1 } from '../../__fixtures__/store/network'
import { profile1 } from '../../__fixtures__/store/profile'

Vue.use(Vuex)
Vue.use(apiClient)

describe('TransactionModule', () => {
  const transactions = [
    { id: 0, recipient: 'A0', sender: 'A4', profileId: 'otherId' },
    { id: 1, recipient: 'A1', sender: 'A2', profileId: profile1.id },
    { id: 3, recipient: 'A3', sender: 'A2', profileId: 'otherId' },
    { id: 4, recipient: 'A3', sender: 'A3', profileId: profile1.id },
    { id: 5, recipient: 'A4', sender: 'A3', profileId: profile1.id },
    { id: 6, recipient: 'A5', sender: 'A1', profileId: profile1.id },
    { id: 7, recipient: 'A5', sender: 'A1', profileId: profile1.id },
    { id: 8, recipient: 'A5', sender: 'Aex', profileId: profile1.id, isExpired: true },
    { id: 9, recipient: 'A5', sender: 'Aex', profileId: profile1.id, isExpired: true }
  ]

  const wallets = [
    { id: 1, address: 'A2', profileId: profile1.id, name: 'name1' },
    { id: 2, address: 'A3', profileId: profile1.id, name: 'name2' },
    { id: 3, address: 'A4', profileId: profile1.id, name: 'name3' },
    { id: 4, address: 'A5', profileId: profile1.id, name: 'name4' },
    { id: 5, address: 'Aex', profileId: profile1.id, name: 'expirable' }
  ]

  beforeAll(() => {
    store.commit('network/SET_ALL', [network1])
    store.commit('profile/CREATE', profile1)
    store.commit('session/SET_PROFILE_ID', profile1.id)
  })

  beforeEach(() => {
    transactions.forEach(transaction => store.commit('transaction/STORE', transaction))
    wallets.forEach(wallet => store.commit('wallet/STORE', wallet))
    ClientService.host = 'http://127.0.0.1:4003'
    nock.cleanAll()
  })

  describe('getters byAddress', () => {
    describe('when the address param does not exist', () => {
      it('should return an empty `Array`', () => {
        expect(store.getters['transaction/byAddress']('AunKno0n')).toBeEmpty()
      })
    })

    describe('when the address is used as recipient', () => {
      it('should find and return the transactions of the current profile', () => {
        const found = store.getters['transaction/byAddress']('A4')

        expect(found).toEqual([
          transactions[4]
        ])

        found.forEach(transaction => {
          expect(transaction).toHaveProperty('totalAmount')
          expect(transaction).toHaveProperty('isSender')
          expect(transaction).toHaveProperty('isRecipient', true)
        })
      })
    })

    describe('when the address is used as sender', () => {
      it('should find and return the transactions of the current profile', () => {
        const found = store.getters['transaction/byAddress']('A2')

        expect(found).toIncludeSameMembers([
          transactions[1]
        ])

        found.forEach(transaction => {
          expect(transaction).toHaveProperty('totalAmount')
          expect(transaction).toHaveProperty('isSender', true)
          expect(transaction).toHaveProperty('isRecipient')
        })
      })
    })

    describe('when the address is used as recipient and sender', () => {
      it('should find and return the transactions of the current profile', () => {
        const found = store.getters['transaction/byAddress']('A3')

        expect(found).toIncludeSameMembers([
          transactions[3],
          transactions[4]
        ])

        found.forEach(transaction => {
          expect(transaction).toHaveProperty('totalAmount')
          expect(transaction).toHaveProperty('isSender', transaction.sender === 'A3')
          expect(transaction).toHaveProperty('isRecipient', transaction.recipient === 'A3')
        })
      })
    })

    describe('when not passing `includeExpired`', () => {
      it('should find and return the transactions of the current profile that have not expired', () => {
        const found = store.getters['transaction/byAddress']('A5')

        expect(found).toIncludeSameMembers([
          transactions[5],
          transactions[6]
        ])

        found.forEach(transaction => {
          expect(transaction).toHaveProperty('totalAmount')
          expect(transaction).toHaveProperty('isSender', transaction.sender === 'A5')
        })
      })
    })

    describe('when passing `includeExpired` as `false`', () => {
      it('should find and return the transactions of the current profile that have not expired', () => {
        const found = store.getters['transaction/byAddress']('A5', { includeExpired: false })

        expect(found).toIncludeSameMembers([
          transactions[5],
          transactions[6]
        ])

        found.forEach(transaction => {
          expect(transaction).toHaveProperty('totalAmount')
          expect(transaction).toHaveProperty('isSender', transaction.sender === 'A5')
        })
      })
    })

    describe('when passing `includeExpired` as `true`', () => {
      it('should find and return all the transactions of the current profile, even those that have expired', () => {
        const found = store.getters['transaction/byAddress']('A5', { includeExpired: true })

        expect(found).toIncludeSameMembers([
          transactions[5],
          transactions[6],
          transactions[7],
          transactions[8]
        ])

        found.forEach(transaction => {
          expect(transaction).toHaveProperty('totalAmount')
          expect(transaction).toHaveProperty('isSender', transaction.sender === 'A5')
        })
      })
    })
  })

  describe.skip('getters byProfileId', () => {
    describe('when the profile does not have any transaction', () => {
      it('should return an empty `Array`', () => {
        expect(store.getters['transaction/byProfileId']('unknownId')).toBeEmpty()
      })
    })

    describe('when the profile has transactions', () => {
      it('should return them, without transactions from other profiles', () => {
        const transactions = store.getters['transaction/byProfileId'](profile1.id)

        expect(transactions).toIncludeSameMembers([
          transactions[1],
          transactions[3],
          transactions[4],
          transactions[5]
        ])

        transactions.forEach(transaction => {
          expect(transaction).toHaveProperty('totalAmount')
          expect(transaction).toHaveProperty('isSender')
          expect(transaction).toHaveProperty('isRecipient')
        })
      })
    })
  })

  describe('getters staticFee', () => {
    it('should return a single fee', () => {
      store.commit('transaction/SET_STATIC_FEES', {
        networkId: network1.id,
        staticFees: [1, 2, 3, 4, 5]
      })

      expect(store.getters['transaction/staticFee'](0)).toEqual(1)
      expect(store.getters['transaction/staticFee'](1)).toEqual(2)
      expect(store.getters['transaction/staticFee'](2)).toEqual(3)
      expect(store.getters['transaction/staticFee'](3)).toEqual(4)
      expect(store.getters['transaction/staticFee'](4)).toEqual(5)
    })

    it('should return null if no fee', () => {
      store.commit('transaction/SET_STATIC_FEES', {
        networkId: network1.id,
        staticFees: []
      })

      expect(store.getters['transaction/staticFee'](0)).not.toBe(expect.anything())
    })
  })

  describe('dispatch updateStaticFees', () => {
    it('should return update all fees on v2', async () => {
      nock('http://127.0.0.1:4003')
        .get('/api/transactions/fees')
        .reply(200, {
          data: {
            transfer: 1,
            secondSignature: 2,
            delegateRegistration: 3,
            vote: 4,
            multiSignature: 5
          }
        })

      await store.dispatch('transaction/updateStaticFees')

      expect(store.getters['transaction/staticFee'](0)).toEqual(1)
      expect(store.getters['transaction/staticFee'](1)).toEqual(2)
      expect(store.getters['transaction/staticFee'](2)).toEqual(3)
      expect(store.getters['transaction/staticFee'](3)).toEqual(4)
      expect(store.getters['transaction/staticFee'](4)).toEqual(5)
    })
  })

  describe('clear unconfirmed votes', () => {
    beforeEach(() => {
      store.commit('session/SET_UNCONFIRMED_VOTES', [
        {
          id: 1,
          timestamp: dayjs().subtract(6, 'hour').valueOf()
        },
        {
          id: 2,
          timestamp: dayjs().subtract(5, 'hour').valueOf()
        },
        {
          id: 3
        }
      ])
    })

    it('should clear unconfirmed votes after 6h or no timestamp', async () => {
      expect(store.getters['session/unconfirmedVotes'].length).toBe(3)
      await store.dispatch('transaction/clearUnconfirmedVotes')
      expect(store.getters['session/unconfirmedVotes'].length).toBe(1)
      expect(store.getters['session/unconfirmedVotes'][0].id).toBe(2)
    })
  })
})
