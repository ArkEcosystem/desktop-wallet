import Vue from 'vue'
import Vuex from 'vuex'
import apiClient from '@/plugins/api-client'
import LedgerModule from '@/store/modules/ledger'

Vue.use(Vuex)
Vue.use(apiClient)

const nethash = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
const store = new Vuex.Store({
  modules: {
    ledger: LedgerModule,
    session: {
      namespaced: true,
      getters: {
        profile () {
          return {
            networkId: 'abc'
          }
        },
        network () {
          return {
            id: 'abc',
            nethash
          }
        }
      }
    }
  },
  strict: true
})

beforeEach(async () => {
  await store.dispatch('ledger/disconnect')
})
describe('ledger store module', () => {
  it('should init ledger service', (done) => {
    store.dispatch('ledger/init', 1234)

    expect(store.state.ledger.slip44).toBe(1234)
    setTimeout(() => {
      expect(store.state.ledger.connectionTimer).toBeTruthy()
      done()
    }, 3000)
  })

  it('should set slip44 value', () => {
    store.dispatch('ledger/init', 4567)

    expect(store.state.ledger.slip44).toBe(4567)
  })

  describe('getWallet', () => {
    it('should return address and publicKey', async () => {
      await store.dispatch('ledger/connect')
      expect(await store.dispatch('ledger/getWallet', 1)).toEqual({
        address: 'DLWeBuwSBFYtUFj8kFB8CFswfvN2ht3yKn',
        publicKey: '0278a28d0eac9916ef46613d9dbac706acc218e64864d4b4c1fcb0c759b6205b2b'
      })
    })

    it('should fail with invalid accountIndex', async () => {
      expect(await store.dispatch('ledger/getWallet')).toBe(false)
    })

    it('should fail when not connected', async () => {
      store.commit('ledger/SET_CONNECTED', false)
      const response = await store.dispatch('ledger/getWallet', 1)

      expect(store.getters['ledger/isConnected']).toBe(false)
      expect(response).toBe(false)
    })
  })

  describe('getAddress', () => {
    it('should fail with invalid accountIndex', async () => {
      expect(await store.dispatch('ledger/getAddress')).toBe(false)
    })

    it('should fail when not connected', async () => {
      store.commit('ledger/SET_CONNECTED', false)
      const response = await store.dispatch('ledger/getAddress', 1)

      expect(store.getters['ledger/isConnected']).toBe(false)
      expect(response).toBe(false)
    })
  })

  describe('getPublicKey', () => {
    it('should fail with invalid accountIndex', async () => {
      expect(await store.dispatch('ledger/getPublicKey')).toBe(false)
    })

    it('should fail when not connected', async () => {
      store.commit('ledger/SET_CONNECTED', false)
      const response = await store.dispatch('ledger/getPublicKey', 1)

      expect(store.getters['ledger/isConnected']).toBe(false)
      expect(response).toBe(false)
    })
  })

  describe('signTransaction', () => {
    it('should fail with invalid accountIndex', async () => {
      expect(await store.dispatch('ledger/signTransaction')).toBe(false)
    })

    it('should fail when not connected', async () => {
      store.commit('ledger/SET_CONNECTED', false)
      const response = await store.dispatch('ledger/signTransaction', 1, 'abc')

      expect(store.getters['ledger/isConnected']).toBe(false)
      expect(response).toBe(false)
    })
  })
})
