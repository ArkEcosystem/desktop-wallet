import { keyBy } from 'lodash'
import ledgerService from '@/services/ledger-service'
import eventBus from '@/plugins/event-bus'
import { crypto } from '@arkecosystem/crypto'
import logger from 'electron-log'

export default {
  namespaced: true,

  state: {
    slip44: null,
    isLoading: false,
    isConnected: false,
    connectionTimer: null,
    wallets: [],
    walletCache: {}
  },

  getters: {
    isLoading: state => state.isLoading,
    isConnected: state => state.isConnected,
    wallets: state => Object.values(state.wallets),
    walletsObject: state => state.wallets,
    wallet: state => (address) => {
      if (!state.wallets[address]) {
        return null
      }

      return state.wallets[address]
    },
    cachedWallets: (state, _, __, rootGetters) => firstAddress => {
      const profileId = rootGetters['session/profileId']
      if (!state.walletCache[profileId]) {
        return []
      }

      for (const batch of state.walletCache[profileId]) {
        if (!batch.length) {
          continue
        }
        if (batch[0].address === firstAddress) {
          return batch
        }
      }

      return []
    }
  },

  mutations: {
    RESET (state) {
      state.slip44 = null
      state.isLoading = false
      state.isConnected = false
      state.connectionTimer = null
      state.wallets = []
    },
    SET_SLIP44 (state, slip44) {
      state.slip44 = slip44
    },
    SET_LOADING (state, isLoading) {
      state.isLoading = isLoading
    },
    SET_CONNECTED (state, isConnected) {
      state.isConnected = isConnected
    },
    SET_CONNECTION_TIMER (state, connectionTimer) {
      state.connectionTimer = connectionTimer
    },
    SET_WALLET (state, wallet) {
      if (!state.wallets[wallet.address]) {
        throw new Error(`Wallet ${wallet.address} not found in ledger wallets`)
      }

      state.wallets[wallet.address] = wallet
    },
    SET_WALLETS (state, wallets) {
      state.wallets = wallets
    },
    CACHE_WALLETS (state, { wallets, profileId }) {
      if (!wallets.length) {
        return
      }

      if (!state.walletCache[profileId]) {
        state.walletCache[profileId] = [
          wallets
        ]

        return
      }

      const firstAddress = wallets[0].address
      for (const batchId in state.walletCache[profileId]) {
        const batch = state.walletCache[profileId][batchId]
        if (!batch.length) {
          continue
        }
        if (batch[0].address === firstAddress) {
          state.walletCache[profileId][batchId] = wallets

          return
        }
      }

      state.walletCache[profileId].push(wallets)
    },
    CLEAR_WALLET_CACHE (state, profileId) {
      state.walletCache[profileId] = []
    }
  },

  actions: {
    /**
     * Reset store for new session.
     */
    reset ({ commit }) {
      commit('RESET')
    },

    /**
     * Initialise ledger service with ark-ledger library.
     * @param {Number} slip44
     */
    async init ({ dispatch }, slip44) {
      dispatch('setSlip44', slip44)
      dispatch('ensureConnection')
    },

    /**
     * Try connecting to ledger device.
     * @return {Boolean} true if connected, false if failed
     */
    async connect ({ commit, dispatch }) {
      if (!await ledgerService.connect()) {
        return false
      }

      commit('SET_CONNECTED', true)
      eventBus.emit('ledger:connected')
      await dispatch('reloadWallets')

      return true
    },

    /**
     * Flag ledger as disconnected.
     * @return {void}
     */
    async disconnect ({ commit, dispatch }) {
      commit('SET_CONNECTED', false)
      await ledgerService.disconnect()
      eventBus.emit('ledger:disconnected')
      commit('SET_WALLETS', [])
      dispatch('ensureConnection')
    },

    /**
     * Start connect process.
     * @param {Object} [obj]
     * @param  {Boolean} [obj.isTimer=false] Determines if method is called from within the timer.
     * @param  {Number} [obj.delay=2000] Delay in between connection attempts.
     * @return {void}
     */
    async ensureConnection ({ commit, state, dispatch }, { isTimer, delay } = { isTimer: false, delay: 2000 }) {
      if (state.isConnected && !await dispatch('checkConnected')) {
        await dispatch('disconnect')
        delay = 2000
      }

      if (!isTimer && state.connectionTimer) {
        return
      }

      if (!state.isConnected) {
        if (await dispatch('connect')) {
          delay = 5000
        }
      }

      commit('SET_CONNECTION_TIMER', setTimeout(() => {
        dispatch('ensureConnection', {
          delay,
          isTimer: true
        })
      }, delay))
    },

    /**
     * Check we're still connected to the Ledger.
     * @return {Boolean}
     */
    async checkConnected ({ state }) {
      if (!state.isConnected) {
        return false
      }

      return ledgerService.isConnected()
    },

    /**
     * Set slip44 value.
     * @param  {Number} slip44
     * @return {void}
     */
    setSlip44 ({ commit }, slip44) {
      commit('SET_SLIP44', slip44)
    },

    /**
     * Reload wallets into store.
     * @param  {Boolean} [clearFirst=false] Clear ledger wallets from store before reloading
     * @return {Object[]}
     */
    async reloadWallets ({ commit, dispatch, getters, rootGetters }, clearFirst = false) {
      if (!getters['isConnected']) {
        return []
      }

      if (getters['isLoading']) {
        return []
      }

      const profileId = rootGetters['session/profileId']

      if (clearFirst) {
        commit('SET_WALLETS', [])
      }
      commit('SET_LOADING', true)
      const firstWallet = await dispatch('getWallet', 0)
      const wallets = keyBy(getters['cachedWallets'](firstWallet.address), 'address')
      const startIndex = Object.keys(wallets).length ? Object.keys(wallets).length - 1 : 0

      let batchIncrement = 1
      if (this._vm.$client.hasMultiWalletSearch) {
        batchIncrement = startIndex === 0 ? 10 : 2
      }

      try {
        for (let ledgerIndex = startIndex; ; ledgerIndex += batchIncrement) {
          // Make sure profile hasn't changed
          if (rootGetters['session/profileId'] !== profileId) {
            commit('SET_LOADING', false)

            return []
          }

          const ledgerWallets = []
          for (let batchIndex = 0; batchIndex < batchIncrement; batchIndex++) {
            const index = ledgerIndex + batchIndex
            console.log('load ledger', index)
            let wallet = firstWallet
            if (index > 0) {
              wallet = await dispatch('getWallet', index)
            }
            ledgerWallets.push({ ...wallet, ledgerIndex: index })
          }

          let walletData = []
          if (batchIncrement > 1) {
            walletData = await this._vm.$client.fetchWallets(ledgerWallets.map(wallet => wallet.address))
          } else {
            try {
              walletData = [await this._vm.$client.fetchWallet(ledgerWallets[0].address)]
            } catch (error) {
              logger.error(error)
              const message = error.response ? error.response.data.message : error.message
              if (message !== 'Wallet not found') {
                throw error
              }
            }
          }

          let hasCold = false
          const filteredWallets = []
          for (const ledgerWallet of ledgerWallets) {
            const wallet = walletData.find(wallet => wallet.address === ledgerWallet.address)
            if (!wallet || (wallet.balance === 0 && !wallet.publicKey)) {
              filteredWallets.push({ ...ledgerWallet, balance: 0, isCold: true })
              hasCold = true

              break
            }

            filteredWallets.push({ ...wallet, ...ledgerWallet })
          }

          for (const wallet of filteredWallets) {
            const ledgerName = rootGetters['wallet/ledgerNameByAddress'](wallet.address)
            wallets[wallet.address] = Object.assign(wallet, {
              isLedger: true,
              isSendingEnabled: true,
              name: ledgerName || `Ledger ${wallet.ledgerIndex + 1}`,
              passphrase: null,
              profileId,
              id: wallet.address
            })
          }

          if (hasCold) {
            break
          }
        }
      } catch (error) {
        logger.error(error)
      }
      commit('SET_WALLETS', wallets)
      eventBus.emit('ledger:wallets-updated', wallets)
      commit('SET_LOADING', false)
      dispatch('cacheWallets')

      return wallets
    },

    /**
     * Store ledger wallets in the cache.
     * @param  {Number} accountIndex Index of wallet to get address for.
     * @return {(String|Boolean)}
     */
    async updateWallet ({ commit, dispatch, getters, rootGetters }, updatedWallet) {
      commit('SET_WALLET', updatedWallet)
      eventBus.emit('ledger:wallets-updated', getters['walletsObject'])
      dispatch('cacheWallets')
    },

    /**
     * Store ledger wallets in the cache.
     * @param  {Number} accountIndex Index of wallet to get address for.
     * @return {(String|Boolean)}
     */
    async cacheWallets ({ commit, getters, rootGetters }) {
      if (rootGetters['session/ledgerCache']) {
        commit('CACHE_WALLETS', {
          wallets: getters['wallets'],
          profileId: rootGetters['session/profileId']
        })
      }
    },

    /**
     * Clear all ledger wallets from cache.
     * @param  {Number} accountIndex Index of wallet to get address for.
     * @return {(String|Boolean)}
     */
    async clearWalletCache ({ commit, rootGetters }) {
      commit('CLEAR_WALLET_CACHE', rootGetters['session/profileId'])
    },

    /**
     * Get address and public key from ledger wallet.
     * @param  {Number} accountIndex Index of wallet to get data for.
     * @return {(String|Boolean)}
     */
    async getWallet ({ dispatch }, accountIndex) {
      try {
        return await dispatch('action', {
          action: 'getWallet',
          accountIndex
        })
      } catch (error) {
        logger.error(error)
        throw new Error(`Could not get wallet: ${error}`)
      }
    },

    /**
     * Get address from ledger wallet.
     * @param  {Number} accountIndex Index of wallet to get address for.
     * @return {(String|Boolean)}
     */
    async getAddress ({ dispatch }, accountIndex) {
      try {
        return await dispatch('action', {
          action: 'getAddress',
          accountIndex
        })
      } catch (error) {
        logger.error(error)
        throw new Error(`Could not get address: ${error}`)
      }
    },

    /**
     * Get public key from ledger wallet.
     * @param  {Number} [accountIndex] Index of wallet to get public key for.
     * @return {(String|Boolean)}
     */
    async getPublicKey ({ dispatch }, accountIndex) {
      try {
        return await dispatch('action', {
          action: 'getPublicKey',
          accountIndex
        })
      } catch (error) {
        logger.error(error)
        throw new Error(`Could not get public key: ${error}`)
      }
    },

    /**
     * Sign transaction for ledger wallet.
     * @param {Object} obj
     * @param  {String} obj.transactionHex Hex of transaction.
     * @param  {Number} obj.accountIndex Index of wallet to sign transaction for.
     * @return {(String|Boolean)}
     */
    async signTransaction ({ dispatch }, { transactionHex, accountIndex } = {}) {
      try {
        return await dispatch('action', {
          action: 'signTransaction',
          accountIndex,
          data: transactionHex
        })
      } catch (error) {
        logger.error(error)
        throw new Error(`Could not sign transaction: ${error}`)
      }
    },

    /**
     * Action method to act as a wrapper for ledger methods
     * @param {Object} obj
     * @param  {String} obj.action       Action to perform
     * @param  {Number} obj.accountIndex Index of wallet to access.
     * @param  {*}      obj.data         Data used for any actions that need it.
     * @return {String}
     */
    async action ({ state, dispatch, rootGetters }, { action, accountIndex, data } = {}) {
      if (accountIndex === undefined || !Number.isFinite(accountIndex)) {
        throw new Error('accountIndex must be a Number')
      }

      if (!state.isConnected) {
        await dispatch('ensureConnection')
        if (!state.isConnected) {
          throw new Error('Ledger not connected')
        }
      }

      const path = `44'/${state.slip44}'/${accountIndex || 0}'/0/0`
      const actions = {
        getWallet: async () => {
          const response = await ledgerService.getWallet(path)
          const publicKey = response.publicKey
          const network = rootGetters['session/network']

          return {
            address: crypto.getAddress(publicKey, network.version),
            publicKey
          }
        },
        getAddress: async () => {
          const response = await ledgerService.getWallet(path)
          const publicKey = response.publicKey
          const network = rootGetters['session/network']

          return crypto.getAddress(publicKey, network.version)
        },
        getPublicKey: async () => {
          const response = await ledgerService.getWallet(path)

          return response.publicKey
        },
        signTransaction: async () => {
          const response = await ledgerService.signTransaction(path, data)

          return response.signature
        }
      }

      if (!actions.hasOwnProperty(action)) {
        throw new Error('Action does not exist')
      }

      try {
        const response = await actions[action]()

        return response
      } catch (error) {
        await dispatch('disconnect')
        throw new Error('Ledger disconnected')
      }
    }
  }
}
