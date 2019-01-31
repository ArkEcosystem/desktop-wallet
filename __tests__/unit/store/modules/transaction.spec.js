import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
import Vuex from 'vuex'
import apiClient, { client as ClientService } from '@/plugins/api-client'
import TransactionModule from '@/store/modules/transaction'
import SessionModule from '@/store/modules/session'
import WalletModule from '@/store/modules/wallet'

Vue.use(Vuex)
Vue.use(apiClient)

const axiosMock = new AxiosMockAdapter(axios)

const store = new Vuex.Store({
  modules: {
    transaction: TransactionModule,
    profile: {
      namespaced: true,
      getters: {
        byId: state => () => {
          return {
            networkId: 'network'
          }
        }
      }
    },
    session: SessionModule,
    wallet: WalletModule
  },
  strict: true
})

describe('TransactionModule', () => {
  const models = [
    { id: 0, recipient: 'A0', sender: 'A4', profileId: 'otherId' },
    { id: 1, recipient: 'A1', sender: 'A2', profileId: 'exampleId' },
    { id: 3, recipient: 'A3', sender: 'A2', profileId: 'otherId' },
    { id: 4, recipient: 'A3', sender: 'A3', profileId: 'exampleId' },
    { id: 5, recipient: 'A4', sender: 'A3', profileId: 'exampleId' },
    { id: 6, recipient: 'A5', sender: 'A1', profileId: 'exampleId' }
  ]

  const wallets = [
    { id: 1, address: 'A2', profileId: 'exampleId', name: 'name1' },
    { id: 2, address: 'A3', profileId: 'exampleId', name: 'name2' },
    { id: 3, address: 'A4', profileId: 'exampleId', name: 'name3' }
  ]

  beforeEach(() => {
    store.commit('session/SET_PROFILE_ID', 'exampleId')
    models.forEach(model => store.commit('transaction/STORE', model))
    wallets.forEach(wallet => store.commit('wallet/STORE', wallet))
    ClientService.version = 1
    ClientService.host = `http://127.0.0.1:4003`
    axiosMock.reset()
  })

  describe('getters byAddress', () => {
    describe('when the address param does not exist', () => {
      it('should return an empty `Array`', () => {
        expect(store.getters['transaction/byAddress']('AunKno0n')).toBeEmpty()
      })
    })

    describe('when the address is used as recipient', () => {
      it('should find and return the transactions of the current profile', () => {
        const transactions = store.getters['transaction/byAddress']('A4')

        expect(transactions).toEqual([
          models[4]
        ])

        transactions.forEach(transaction => {
          expect(transaction).toHaveProperty('totalAmount')
          expect(transaction).toHaveProperty('isSender')
          expect(transaction).toHaveProperty('isRecipient', true)
        })
      })
    })

    describe('when the address is used as sender', () => {
      it('should find and return the transactions of the current profile', () => {
        const transactions = store.getters['transaction/byAddress']('A2')

        expect(transactions).toIncludeSameMembers([
          models[1]
        ])

        transactions.forEach(transaction => {
          expect(transaction).toHaveProperty('totalAmount')
          expect(transaction).toHaveProperty('isSender', true)
          expect(transaction).toHaveProperty('isRecipient')
        })
      })
    })

    describe('when the address is used as recipient and sender', () => {
      it('should find and return the transactions of the current profile', () => {
        const transactions = store.getters['transaction/byAddress']('A3')

        expect(transactions).toIncludeSameMembers([
          models[3],
          models[4]
        ])

        transactions.forEach(transaction => {
          expect(transaction).toHaveProperty('totalAmount')
          expect(transaction).toHaveProperty('isSender', transaction.sender === 'A3')
          expect(transaction).toHaveProperty('isRecipient', transaction.recipient === 'A3')
        })
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
        const transactions = store.getters['transaction/byProfileId']('exampleId')

        expect(transactions).toIncludeSameMembers([
          models[1],
          models[3],
          models[4],
          models[5]
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
        networkId: 'network',
        staticFees: [ 1, 2, 3, 4, 5 ]
      })

      expect(store.getters['transaction/staticFee'](0)).toEqual(1)
      expect(store.getters['transaction/staticFee'](1)).toEqual(2)
      expect(store.getters['transaction/staticFee'](2)).toEqual(3)
      expect(store.getters['transaction/staticFee'](3)).toEqual(4)
      expect(store.getters['transaction/staticFee'](4)).toEqual(5)
    })

    it('should return null if no fee', () => {
      store.commit('transaction/SET_STATIC_FEES', {
        networkId: 'network',
        staticFees: []
      })

      expect(store.getters['transaction/staticFee'](0)).not.toBe(expect.anything())
    })
  })

  describe('dispatch updateStaticFees', () => {
    it('should return update all fees on v1', async () => {
      axiosMock
        .onGet(`http://127.0.0.1:4003/api/blocks/getFees`)
        .reply(200, {
          fees: {
            send: 1,
            secondsignature: 2,
            delegate: 3,
            vote: 4,
            multisignature: 5
          }
        })

      await store.dispatch('transaction/updateStaticFees')

      expect(store.getters['transaction/staticFee'](0)).toEqual(1)
      expect(store.getters['transaction/staticFee'](1)).toEqual(2)
      expect(store.getters['transaction/staticFee'](2)).toEqual(3)
      expect(store.getters['transaction/staticFee'](3)).toEqual(4)
      expect(store.getters['transaction/staticFee'](4)).toEqual(5)
    })

    it('should return update all fees on v2', async () => {
      ClientService.version = 2

      axiosMock
        .onGet(`http://127.0.0.1:4003/api/transactions/fees`)
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
})
