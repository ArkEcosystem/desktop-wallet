import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
import Vuex from 'vuex'
import { crypto } from '@arkecosystem/crypto'
import apiClient, { client as ClientService } from '@/plugins/api-client'
import LedgerModule from '@/store/modules/ledger'
import ledgerService from '@/services/ledger-service'
import testWallets from '../../__fixtures__/store/ledger'
import logger from 'electron-log'

Vue.use(Vuex)
Vue.use(apiClient)

const axiosMock = new MockAdapter(axios)
logger.error = jest.fn()

ClientService.host = 'http://127.0.0.1'
ClientService.version = 2

let ledgerNameByAddress = () => null
let ledgerCache = false
const nethash = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
let store = new Vuex.Store({
  modules: {
    ledger: LedgerModule,
    session: {
      namespaced: true,
      getters: {
        ledgerCache () {
          return ledgerCache
        },
        profile () {
          return {
            networkId: 'abc'
          }
        },
        profileId () {
          return 'profile id'
        },
        network () {
          return {
            id: 'abc',
            nethash
          }
        }
      }
    },
    wallet: {
      namespaced: true,
      getters: {
        ledgerNameByAddress: () => address => {
          return ledgerNameByAddress(address)
        }
      }
    }
  },
  strict: true
})

let spyConnect
const disconnectLedger = async () => {
  spyConnect = jest.spyOn(
    ledgerService,
    'connect'
  ).mockImplementation(() => {
    return false
  })
  await store.dispatch('ledger/disconnect')
}

const initialState = JSON.parse(JSON.stringify(store.state))
beforeEach(async () => {
  if (spyConnect) {
    spyConnect.mockRestore()
  }
  store.replaceState(JSON.parse(JSON.stringify(initialState)))
  ClientService.hasMultiWalletSearch = false
  ledgerNameByAddress = () => null
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
      expect(await store.dispatch('ledger/getWallet', 1)).toEqual({
        address: 'DLWeBuwSBFYtUFj8kFB8CFswfvN2ht3yKn',
        publicKey: '0278a28d0eac9916ef46613d9dbac706acc218e64864d4b4c1fcb0c759b6205b2b'
      })
    })

    it('should fail with invalid accountIndex', async () => {
      await expect(store.dispatch('ledger/getWallet')).rejects.toThrow(/.*accountIndex must be a Number$/)
    })

    it('should fail when not connected', async () => {
      await disconnectLedger()
      await expect(store.dispatch('ledger/getWallet', 1)).rejects.toThrow(/.*Ledger not connected$/)
    })
  })

  describe('getAddress', () => {
    it('should fail with invalid accountIndex', async () => {
      await expect(store.dispatch('ledger/getAddress')).rejects.toThrow(/.*accountIndex must be a Number$/)
    })

    it('should fail when not connected', async () => {
      await disconnectLedger()
      await expect(store.dispatch('ledger/getAddress', 1)).rejects.toThrow(/.*Ledger not connected$/)
    })
  })

  describe('getPublicKey', () => {
    it('should fail with invalid accountIndex', async () => {
      await expect(store.dispatch('ledger/getPublicKey')).rejects.toThrow(/.*accountIndex must be a Number$/)
    })

    it('should fail when not connected', async () => {
      await disconnectLedger()
      await expect(store.dispatch('ledger/getPublicKey', 1)).rejects.toThrow(/.*Ledger not connected$/)
    })
  })

  describe('signTransaction', () => {
    it('should fail with invalid accountIndex', async () => {
      await expect(store.dispatch('ledger/signTransaction')).rejects.toThrow(/.*accountIndex must be a Number$/)
    })

    it('should fail when not connected', async () => {
      await disconnectLedger()
      await expect(store.dispatch('ledger/signTransaction', {
        accountIndex: 1,
        transactionHex: 'abc'
      })).rejects.toThrow(/.*Ledger not connected$/)
    })
  })

  describe('reloadWallets', () => {
    let spyGetWallet
    let spyCryptoGetAddress
    let ledgerWallets
    let expectedWallets
    beforeEach(() => {
      if (spyGetWallet) {
        spyGetWallet.mockRestore()
      }
      if (spyCryptoGetAddress) {
        spyCryptoGetAddress.mockRestore()
      }
      spyGetWallet = jest.spyOn(
        ledgerService,
        'getWallet'
      ).mockImplementation((path) => {
        const matches = path.match(/^44'+\/.+'\/([0-9]+)'\/0\/0/)

        return testWallets[matches[1]]
      })
      spyCryptoGetAddress = jest.spyOn(
        crypto,
        'getAddress'
      ).mockImplementation((publicKey) => {
        return testWallets.find(wallet => wallet.publicKey === publicKey).address
      })

      ledgerWallets = testWallets.slice(0, 10).map(wallet => ({ ...wallet, balance: 10 }))
      expectedWallets = {}
      for (const walletId in ledgerWallets) {
        const wallet = ledgerWallets[walletId]
        const newWallet = {
          ...wallet,
          isLedger: true,
          isSendingEnabled: true,
          name: `Ledger ${+walletId + 1}`,
          passphrase: null,
          profileId: 'profile id',
          id: wallet.address,
          ledgerIndex: +walletId
        }
        if (wallet.address === 'address 10') {
          newWallet.balance = 0
          newWallet.isCold = true
        }
        expectedWallets[wallet.address] = newWallet
      }
    })

    it('should not start if not connected', async () => {
      await disconnectLedger()
      expect(await store.dispatch('ledger/reloadWallets')).toEqual([])
    })

    it('should not start if already loading', async () => {
      store.commit('ledger/SET_LOADING', true)
      expect(await store.dispatch('ledger/reloadWallets')).toEqual([])
    })

    it('should load all wallets without multi-wallet search', async () => {
      for (const wallet of ledgerWallets) {
        if (wallet.address === 'address 10') {
          continue
        }

        axiosMock
          .onGet(`http://127.0.0.1/api/wallets/${wallet.address}`)
          .reply(200, {
            data: wallet
          })
      }

      axiosMock
        .onGet(`http://127.0.0.1/api/wallets/address 10`)
        .reply(404, {
          statusCode: 404,
          error: 'Not Found',
          message: 'Wallet not found'
        })

      await store.dispatch('ledger/connect')
      expect(await store.dispatch('ledger/reloadWallets')).toEqual(expectedWallets)
    })

    it('should load all wallets with multi-wallet search', async () => {
      ClientService.hasMultiWalletSearch = true

      axiosMock
        .onPost(`http://127.0.0.1/api/wallets/search`)
        .reply(200, {
          data: ledgerWallets.slice(0, 9)
        })

      await store.dispatch('ledger/connect')
      expect(await store.dispatch('ledger/reloadWallets')).toEqual(expectedWallets)
    })

    it('should use ledger name', async () => {
      ClientService.hasMultiWalletSearch = true
      ledgerNameByAddress = (address) => address

      axiosMock
        .onPost(`http://127.0.0.1/api/wallets/search`)
        .reply(200, {
          data: ledgerWallets.slice(0, 9)
        })

      for (const walletId in expectedWallets) {
        expectedWallets[walletId].name = expectedWallets[walletId].address
      }

      await store.dispatch('ledger/connect')
      expect(await store.dispatch('ledger/reloadWallets')).toEqual(expectedWallets)
    })

    xit('should stop if profile changes', () => {
      //
    })
  })

  describe('updateWallet', () => {
    it('should update a single wallet', async () => {
      store.commit('ledger/SET_WALLETS', {
        A1: { address: 'A1', balance: 0 }
      })
      await store.dispatch('ledger/updateWallet', { address: 'A1', balance: 10 })
      expect(store.getters['ledger/wallets']).toEqual([
        { address: 'A1', balance: 10 }
      ])
    })

    it('should throw an error if wallet does not exist', async () => {
      expect(store.dispatch('ledger/updateWallet', { address: 'nope' })).rejects.toThrow(/.*not found in ledger wallets$/)
    })
  })

  describe('cacheWallets', () => {
    it('should cache if enabled in session', async () => {
      ledgerCache = true
      await store.commit('ledger/SET_WALLETS', {
        A1: { address: 'A1', balance: 0 }
      })
      await store.dispatch('ledger/cacheWallets')
      expect(store.getters['ledger/cachedWallets']('A1')).toEqual([{ address: 'A1', balance: 0 }])
    })

    it('should not cache if disabled in session', async () => {
      ledgerCache = false
      await store.commit('ledger/SET_WALLETS', {
        A1: { address: 'A1', balance: 0 }
      })
      await store.dispatch('ledger/cacheWallets')
      expect(store.getters['ledger/cachedWallets']('A1')).toEqual([])
    })
  })

  describe('clearWalletCache', () => {
    it('should clear the cached wallets', async () => {
      ledgerCache = true
      await store.commit('ledger/SET_WALLETS', {
        A1: { address: 'A1' }
      })
      await store.dispatch('ledger/cacheWallets')
      await store.dispatch('ledger/clearWalletCache')

      expect(store.getters['ledger/cachedWallets']('A1')).toEqual([])
    })
  })
})
