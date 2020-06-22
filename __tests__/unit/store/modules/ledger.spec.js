import nock from 'nock'
import Vue from 'vue'
import Vuex from 'vuex'
import { Identities } from '@arkecosystem/crypto'
import apiClient, { client as ClientService } from '@/plugins/api-client'
import LedgerModule from '@/store/modules/ledger'
import ledgerService from '@/services/ledger-service'
import testWallets from '../../__fixtures__/store/ledger'
import logger from 'electron-log'

Vue.use(Vuex)
Vue.use(apiClient)

logger.error = jest.fn()

let ledgerNameByAddress = () => null
const sessionNetwork = jest.fn()

let ledgerCache = false
const nethash = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
const store = new Vuex.Store({
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
          return sessionNetwork()
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
  spyConnect = jest.spyOn(ledgerService, 'connect').mockImplementation(() => false)
  await store.dispatch('ledger/disconnect')
}

const initialState = JSON.parse(JSON.stringify(store.state))
beforeEach(async () => {
  if (spyConnect) {
    spyConnect.mockRestore()
  }

  store.replaceState(JSON.parse(JSON.stringify(initialState)))

  sessionNetwork.mockReturnValue({
    id: 'abc',
    nethash,
    constants: {
      aip11: false
    }
  })

  store._vm.$error = jest.fn()

  ClientService.host = 'http://127.0.0.1'
  ledgerNameByAddress = () => null
  nock.cleanAll()
})

describe('ledger store module', () => {
  it('should init ledger service', async () => {
    await store.dispatch('ledger/init', 1234)

    expect(store.state.ledger.slip44).toBe(1234)
  })

  it('should set slip44 value', async () => {
    await store.dispatch('ledger/init', 4567)

    expect(store.state.ledger.slip44).toBe(4567)
  })

  describe('updateVersion', () => {
    it('should not show error if disconnected', async () => {
      sessionNetwork.mockReturnValue({
        id: 'abc',
        nethash,
        constants: {
          aip11: true
        }
      })

      await store.dispatch('ledger/connect')
      await store.dispatch('ledger/setSlip44', 1234)
      await disconnectLedger()
      store._vm.$error.mockReset()
      await store.dispatch('ledger/updateVersion')

      expect(store._vm.$error).not.toHaveBeenCalled()
    })

    it('should not show error if aip11 is false', async () => {
      await store.dispatch('ledger/updateVersion')

      expect(store._vm.$error).not.toHaveBeenCalled()
    })

    it('should show error if aip11 is true', async () => {
      sessionNetwork.mockReturnValue({
        id: 'abc',
        nethash,
        constants: {
          aip11: true
        }
      })

      await store.dispatch('ledger/connect')
      await store.dispatch('ledger/setSlip44', 1234)
      await store.dispatch('ledger/updateVersion')

      expect(store._vm.$error).toHaveBeenCalledWith(
        'Ledger update available! Please update the ARK app via Ledger Live to send transactions on this network',
        10000
      )
    })
  })

  describe('getVersion', () => {
    it('should return version', async () => {
      expect(await store.dispatch('ledger/getVersion')).toEqual('1.0.0')
    })

    it('should fail when not connected', async () => {
      await disconnectLedger()
      await expect(store.dispatch('ledger/getVersion')).rejects.toThrow(/.*Ledger not connected$/)
    })
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
    it('should call ledger service', async () => {
      await store.dispatch('ledger/connect')
      await store.dispatch('ledger/setSlip44', 1234)

      const spy = jest.spyOn(ledgerService, 'getPublicKey').mockReturnValue('PUBLIC_KEY')

      const response = await store.dispatch('ledger/getPublicKey', 1)

      expect(response).toBe('PUBLIC_KEY')
      expect(spy).toHaveBeenNthCalledWith(1, '44\'/1234\'/1\'/0/0')

      spy.mockRestore()
    })

    it('should fail with invalid accountIndex', async () => {
      await expect(store.dispatch('ledger/getAddress')).rejects.toThrow(/.*accountIndex must be a Number$/)
    })

    it('should fail when not connected', async () => {
      await disconnectLedger()
      await expect(store.dispatch('ledger/getAddress', 1)).rejects.toThrow(/.*Ledger not connected$/)
    })
  })

  describe('getPublicKey', () => {
    it('should call ledger service', async () => {
      await store.dispatch('ledger/connect')
      await store.dispatch('ledger/setSlip44', 1234)

      const spy = jest.spyOn(ledgerService, 'getPublicKey').mockReturnValue('PUBLIC_KEY')

      const response = await store.dispatch('ledger/getPublicKey', 1)

      expect(response).toBe('PUBLIC_KEY')
      expect(spy).toHaveBeenNthCalledWith(1, '44\'/1234\'/1\'/0/0')

      spy.mockRestore()
    })

    it('should fail with invalid accountIndex', async () => {
      await expect(store.dispatch('ledger/getPublicKey')).rejects.toThrow(/.*accountIndex must be a Number$/)
    })

    it('should fail when not connected', async () => {
      await disconnectLedger()
      await expect(store.dispatch('ledger/getPublicKey', 1)).rejects.toThrow(/.*Ledger not connected$/)
    })
  })

  describe('signTransaction', () => {
    it('should call ledger service', async () => {
      await store.dispatch('ledger/connect')
      await store.dispatch('ledger/setSlip44', 1234)

      const spy = jest.spyOn(ledgerService, 'signTransaction').mockReturnValue('SIGNATURE')

      const response = await store.dispatch('ledger/signTransaction', {
        accountIndex: 1,
        transactionBytes: Buffer.from([1, 2, 3, 4])
      })

      expect(response).toBe('SIGNATURE')
      expect(spy).toHaveBeenNthCalledWith(1, '44\'/1234\'/1\'/0/0', Buffer.from([1, 2, 3, 4]))

      spy.mockRestore()
    })

    it('should fail with invalid accountIndex', async () => {
      await expect(store.dispatch('ledger/signTransaction')).rejects.toThrow(/.*accountIndex must be a Number$/)
    })

    it('should fail when not connected', async () => {
      await disconnectLedger()
      await expect(store.dispatch('ledger/signTransaction', {
        accountIndex: 1,
        transactionBytes: Buffer.from('abc', 'utf-8')
      })).rejects.toThrow(/.*Ledger not connected$/)
    })
  })

  describe('signTransactionWithSchnorr', () => {
    it('should call ledger service', async () => {
      await store.dispatch('ledger/connect')
      await store.dispatch('ledger/setSlip44', 1234)

      const spy = jest.spyOn(ledgerService, 'signTransactionWithSchnorr').mockReturnValue('SIGNATURE')

      const response = await store.dispatch('ledger/signTransactionWithSchnorr', {
        accountIndex: 1,
        transactionBytes: 'abc'
      })

      expect(response).toBe('SIGNATURE')
      expect(spy).toHaveBeenNthCalledWith(1, '44\'/1234\'/1\'/0/0', 'abc')

      spy.mockRestore()
    })

    it('should fail with invalid accountIndex', async () => {
      await expect(store.dispatch('ledger/signTransactionWithSchnorr')).rejects.toThrow(/.*accountIndex must be a Number$/)
    })

    it('should fail when not connected', async () => {
      await disconnectLedger()
      await expect(store.dispatch('ledger/signTransactionWithSchnorr', {
        accountIndex: 1,
        transactionBytes: 'abc'
      })).rejects.toThrow(/.*Ledger not connected$/)
    })
  })

  describe('signMessage', () => {
    it('should call ledger service', async () => {
      await store.dispatch('ledger/connect')
      await store.dispatch('ledger/setSlip44', 1234)

      const spy = jest.spyOn(ledgerService, 'signMessage').mockReturnValue('SIGNATURE')

      const response = await store.dispatch('ledger/signMessage', {
        accountIndex: 1,
        messageBytes: Buffer.from('abc', 'utf-8')
      })

      expect(response).toBe('SIGNATURE')
      expect(spy).toHaveBeenNthCalledWith(1, '44\'/1234\'/1\'/0/0', Buffer.from('abc', 'utf-8'))

      spy.mockRestore()
    })

    it('should fail with invalid accountIndex', async () => {
      await expect(store.dispatch('ledger/signMessage')).rejects.toThrow(/.*accountIndex must be a Number$/)
    })

    it('should fail when not connected', async () => {
      await disconnectLedger()
      await expect(store.dispatch('ledger/signMessage', {
        accountIndex: 1,
        messageBytes: Buffer.from('abc', 'utf-8')
      })).rejects.toThrow(/.*Ledger not connected$/)
    })
  })

  describe('signMessageWithSchnorr', () => {
    it('should call ledger service', async () => {
      await store.dispatch('ledger/connect')
      await store.dispatch('ledger/setSlip44', 1234)

      const spy = jest.spyOn(ledgerService, 'signMessageWithSchnorr').mockReturnValue('SIGNATURE')

      const response = await store.dispatch('ledger/signMessageWithSchnorr', {
        accountIndex: 1,
        messageBytes: 'abc'
      })

      expect(response).toBe('SIGNATURE')
      expect(spy).toHaveBeenNthCalledWith(1, '44\'/1234\'/1\'/0/0', 'abc')

      spy.mockRestore()
    })

    it('should fail with invalid accountIndex', async () => {
      await expect(store.dispatch('ledger/signMessageWithSchnorr')).rejects.toThrow(/.*accountIndex must be a Number$/)
    })

    it('should fail when not connected', async () => {
      await disconnectLedger()
      await expect(store.dispatch('ledger/signMessageWithSchnorr', {
        accountIndex: 1,
        messageBytes: 'abc'
      })).rejects.toThrow(/.*Ledger not connected$/)
    })
  })

  describe('reloadWallets', () => {
    let spyGetWallet
    let spyCryptoGetAddress
    let ledgerWallets
    let expectedWallets
    beforeEach(async () => {
      if (spyGetWallet) {
        spyGetWallet.mockRestore()
      }
      if (spyCryptoGetAddress) {
        spyCryptoGetAddress.mockRestore()
      }
      spyGetWallet = jest.spyOn(
        ledgerService,
        'getPublicKey'
      ).mockImplementation((path) => {
        const matches = path.match(/^44'+\/.+'\/([0-9]+)'\/0\/0/)

        return testWallets[matches[1]].publicKey
      })
      spyCryptoGetAddress = jest.spyOn(
        Identities.Address,
        'fromPublicKey'
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

      await store.dispatch('ledger/connect')
    })

    it('should not start if not connected', async () => {
      await disconnectLedger()
      expect(await store.dispatch('ledger/reloadWallets')).toEqual({})
    })

    it('should not start if already loading', async () => {
      store.commit('ledger/SET_LOADING', 'test')
      expect(await store.dispatch('ledger/reloadWallets')).toEqual({})
    })

    it('should mark all other processes to stop on force reload', async () => {
      store.commit('ledger/SET_LOADING', 'test1')
      store.commit('ledger/SET_LOADING', 'test2')
      store.commit('ledger/SET_LOADING', 'test3')
      expect(store.getters['ledger/isLoading']).toBeTruthy()
      expect(store.getters['ledger/isConnected']).toBeTruthy()
      await store.dispatch('ledger/reloadWallets', {
        clearFirst: false,
        forceLoad: true,
        quantity: null
      })
      expect(store.getters['ledger/shouldStopLoading']('test1')).toEqual(true)
      expect(store.getters['ledger/shouldStopLoading']('test2')).toEqual(true)
      expect(store.getters['ledger/shouldStopLoading']('test3')).toEqual(true)
    })

    it('should load all wallets with multi-wallet search', async () => {
      nock('http://127.0.0.1')
        .persist()
        .post('/api/wallets/search')
        .reply(200, {
          data: ledgerWallets.slice(0, 9)
        })

      await store.commit('ledger/SET_CONNECTED', true)
      expect(await store.dispatch('ledger/reloadWallets')).toEqual(expectedWallets)
    })

    it('should use ledger name', async () => {
      ledgerNameByAddress = (address) => address

      nock('http://127.0.0.1')
        .persist()
        .post('/api/wallets/search')
        .reply(200, {
          data: ledgerWallets.slice(0, 9)
        })

      for (const walletId in expectedWallets) {
        expectedWallets[walletId].name = expectedWallets[walletId].address
      }

      await store.commit('ledger/SET_CONNECTED', true)
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

  describe('updateWallets', () => {
    it('should set wallets when the state is empty', async () => {
      expect(store.getters['ledger/wallets']).toBeArrayOfSize(0)
      const wallets = { A1: { address: 'A1' } }
      await store.dispatch('ledger/updateWallets', wallets)
      expect(store.getters['ledger/walletsObject']).toMatchObject(wallets)
    })

    it('should not remove existing wallets in the state', async () => {
      expect(store.getters['ledger/wallets']).toBeArrayOfSize(0)
      const wallets = { A1: { address: 'A1', balance: 0 }, A2: { address: 'A2', balance: 1 } }
      await store.dispatch('ledger/updateWallets', wallets)
      expect(store.getters['ledger/wallet']('A2').balance).toBe(1)

      const walletsToUpdate = { A2: { address: 'A2', balance: 0 } }
      await store.dispatch('ledger/updateWallets', walletsToUpdate)
      expect(store.getters['ledger/wallet']('A2').balance).toBe(0)
      expect(store.getters['ledger/wallet']('A1')).toBeObject()
    })
  })
})
