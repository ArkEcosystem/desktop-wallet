import cryptoLibrary from 'crypto'
import { keyBy } from 'lodash'
import logger from 'electron-log'
import Vue from 'vue'
import semver from 'semver'
import { Identities } from '@arkecosystem/crypto'
import i18n from '@/i18n'
import eventBus from '@/plugins/event-bus'
import ledgerService from '@/services/ledger-service'

export default {
  namespaced: true,

  state: {
    slip44: null,
    isConnected: false,
    wallets: {},
    walletCache: {},
    loadingProcesses: {},
    needsUpdate: false,
    ensureConnection: false
  },

  getters: {
    isLoading: state => Object.keys(state.loadingProcesses).length,
    shouldStopLoading: state => processId => state.loadingProcesses[processId],
    isConnected: state => state.isConnected,
    needsUpdate: state => state.needsUpdate,
    isEnsureConnectionRunning: state => state.ensureConnection,
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
    },
    byProfileId: (state, getters, __, rootGetters) => profileId => {
      const profile = rootGetters['profile/byId'](profileId)
      const network = rootGetters['session/network']

      return getters.wallets.filter(wallet => {
        return wallet.profileId === profileId && profile.networkId === network.id
      })
    }
  },

  mutations: {
    RESET (state) {
      state.slip44 = null
      state.isConnected = false
      state.wallets = {}
      state.loadingProcesses = {}
      state.needsUpdate = false
      state.ensureConnection = false
    },
    SET_SLIP44 (state, slip44) {
      state.slip44 = slip44
    },
    SET_NEEDS_UPDATE (state, needsUpdate) {
      state.needsUpdate = needsUpdate
    },
    SET_ENSURE_CONNECTION (state, ensureConnection) {
      state.ensureConnection = ensureConnection
    },
    SET_LOADING (state, processId) {
      Vue.set(state.loadingProcesses, processId, false)
    },
    STOP_ALL_LOADING_PROCESSES (state) {
      for (const processId of Object.keys(state.loadingProcesses)) {
        Vue.set(state.loadingProcesses, processId, true)
      }
    },
    CLEAR_LOADING_PROCESS (state, processId) {
      Vue.delete(state.loadingProcesses, processId)
    },
    SET_CONNECTED (state, isConnected) {
      state.isConnected = isConnected
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
    async init ({ dispatch, getters }, slip44) {
      dispatch('setSlip44', slip44)
      dispatch('ensureConnection')

      const neededUpdate = getters.needsUpdate
      await dispatch('updateVersion')

      if (!getters.needsUpdate && neededUpdate !== getters.needsUpdate) {
        eventBus.emit('ledger:connected')
      }
    },

    /**
     * Update flag to determine if ledger app needs update.
     */
    async updateVersion ({ commit, dispatch, rootGetters, state }) {
      if (!state.isConnected) {
        return
      }

      const network = rootGetters['session/network']

      let needsUpdate = false
      if (network.constants && network.constants.aip11 && semver.lt(await dispatch('getVersion'), '1.2.0')) {
        needsUpdate = true
      }

      commit('SET_NEEDS_UPDATE', needsUpdate)

      if (needsUpdate) {
        this._vm.$error(i18n.t('LEDGER.NEEDS_UPDATE'), 10000)
      }
    },

    /**
     * Try connecting to ledger device.
     * @return {Boolean} true if connected, false if failed
     */
    async connect ({ commit, dispatch, getters }) {
      if (!await ledgerService.connect()) {
        return false
      }

      commit('SET_CONNECTED', true)

      await dispatch('updateVersion')

      if (!getters.needsUpdate) {
        eventBus.emit('ledger:connected')
      }

      await dispatch('reloadWallets', {})

      return true
    },

    /**
     * Flag ledger as disconnected.
     * @return {void}
     */
    async disconnect ({ commit, dispatch }) {
      await commit('STOP_ALL_LOADING_PROCESSES')
      commit('SET_CONNECTED', false)
      await ledgerService.disconnect()
      eventBus.emit('ledger:disconnected')
      commit('SET_WALLETS', {})
      dispatch('ensureConnection')
    },

    /**
     * Start connect process.
     * @param {Object} [obj]
     * @param  {Number} [obj.delay=2000] Delay in between connection attempts.
     * @return {void}
     */
    async ensureConnection ({ commit, dispatch, getters, state }, { delay, reRun } = { delay: 2000, reRun: false }) {
      if (!reRun && getters.isEnsureConnectionRunning) {
        return
      }

      commit('SET_ENSURE_CONNECTION', true)

      if (state.isConnected && !await dispatch('checkConnected')) {
        await dispatch('disconnect')
        delay = 2000
      }

      if (!state.isConnected) {
        if (await dispatch('connect')) {
          delay = 5000
        }
      }

      setTimeout(() => {
        dispatch('ensureConnection', { delay, reRun: true })
      }, delay)
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
     * @param {Object} [obj]
     * @param  {Boolean} [obj.clearFirst=false] Clear ledger wallets from store before reloading
     * @param  {Boolean} [obj.forceLoad=false] Force ledger to load wallets, cancelling in-progress processes
     * @param  {(Number|null)} [obj.quantity=null] Force load a specific number of wallets
     * @return {Object}
     */
    async reloadWallets (
      { commit, dispatch, getters, rootGetters },
      { clearFirst, forceLoad, quantity } = { clearFirst: false, forceLoad: false, quantity: null }
    ) {
      if (!getters.isConnected) {
        return {}
      }

      if (getters.isLoading) {
        if (!forceLoad) {
          return {}
        }

        await commit('STOP_ALL_LOADING_PROCESSES')
      }

      let wallets = {}
      const processId = cryptoLibrary.randomBytes(12).toString('base64')
      try {
        const profileId = rootGetters['session/profileId']

        if (clearFirst) {
          commit('SET_WALLETS', {})
          eventBus.emit('ledger:wallets-updated', {})
        }

        commit('SET_LOADING', processId)
        const firstWallet = await dispatch('getWallet', 0)
        const currentWallets = getters.walletsObject
        const cachedWallets = getters.cachedWallets(firstWallet.address)
        let startIndex = 0
        if (cachedWallets.length) {
          let returnWallets = false
          if (!quantity || quantity > cachedWallets.length) {
            wallets = keyBy(cachedWallets, 'address')
            startIndex = Math.max(0, cachedWallets.length - 1)
          } else if (quantity < cachedWallets.length) {
            wallets = keyBy(cachedWallets.slice(0, quantity), 'address')
            returnWallets = true
          } else {
            wallets = keyBy(cachedWallets, 'address')
            returnWallets = true
          }

          if (returnWallets) {
            if (getters.shouldStopLoading(processId)) {
              commit('CLEAR_LOADING_PROCESS', processId)

              return {}
            }

            commit('SET_WALLETS', wallets)
            eventBus.emit('ledger:wallets-updated', wallets)
            commit('CLEAR_LOADING_PROCESS', processId)
            dispatch('cacheWallets')

            return wallets
          }
        } else if (currentWallets && Object.keys(currentWallets).length) {
          startIndex = Object.keys(currentWallets).length - 1
          wallets = { ...currentWallets }
        }

        let batchIncrement = 10
        if (quantity && Math.abs(quantity - startIndex) < 10) {
          batchIncrement = Math.abs(quantity - startIndex)
        } else if (!quantity && Object.keys(wallets).length > 0) {
          batchIncrement = 2
        }

        for (let ledgerIndex = startIndex; ; ledgerIndex += batchIncrement) {
          if (getters.shouldStopLoading(processId)) {
            commit('CLEAR_LOADING_PROCESS', processId)

            return {}
          }

          const ledgerWallets = []
          for (let batchIndex = 0; batchIndex < batchIncrement; batchIndex++) {
            const index = ledgerIndex + batchIndex
            let wallet = firstWallet
            if (index > 0) {
              wallet = await dispatch('getWallet', index)
            }
            ledgerWallets.push({ ...wallet, ledgerIndex: index })
            if (quantity && ledgerIndex + ledgerWallets.length >= quantity) {
              break
            }
          }

          let hasCold = false
          const walletData = await this._vm.$client.fetchWallets(ledgerWallets.map(wallet => wallet.address))
          const filteredWallets = []
          for (const ledgerWallet of ledgerWallets) {
            const wallet = walletData.find(wallet => wallet.address === ledgerWallet.address)
            if (!wallet || (wallet.balance === 0 && !wallet.publicKey)) {
              filteredWallets.push({ ...ledgerWallet, balance: 0, isCold: true })
              hasCold = true

              if (!quantity) {
                break
              } else {
                continue
              }
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

          if ((hasCold && !quantity) || (quantity && Object.keys(wallets).length >= quantity)) {
            break
          }
        }
      } catch (error) {
        logger.error(error)
      }

      if (getters.shouldStopLoading(processId)) {
        commit('CLEAR_LOADING_PROCESS', processId)

        return {}
      }

      commit('SET_WALLETS', wallets)
      eventBus.emit('ledger:wallets-updated', wallets)
      commit('CLEAR_LOADING_PROCESS', processId)
      dispatch('cacheWallets')

      return wallets
    },

    /**
     * Store ledger wallets in the cache.
     */
    async updateWallet ({ commit, dispatch, getters }, updatedWallet) {
      commit('SET_WALLET', updatedWallet)
      eventBus.emit('ledger:wallets-updated', getters.walletsObject)
      dispatch('cacheWallets')
    },

    /**
     * Store several Ledger wallets at once and cache them.
     */
    async updateWallets ({ commit, dispatch, getters }, walletsToUpdate) {
      commit('SET_WALLETS', {
        ...getters.walletsObject,
        ...walletsToUpdate
      })
      eventBus.emit('ledger:wallets-updated', getters.walletsObject)
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
          wallets: getters.wallets,
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
     * @return {Promise<string>}
     */
    async getVersion ({ dispatch }) {
      try {
        return await dispatch('action', {
          action: 'getVersion'
        })
      } catch (error) {
        logger.error(error)
        throw new Error(`Could not get version: ${error}`)
      }
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
     * @return {Promise<string>}
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
     * Sign transaction for ledger wallet using ecdsa signatures.
     * @param  {Object} obj
     * @param  {Buffer} obj.transactionBytes Bytes of transaction.
     * @param  {Number} obj.accountIndex Index of wallet to sign transaction for.
     * @return {Promise<string>}
     */
    async signTransaction ({ dispatch }, { transactionBytes, accountIndex } = {}) {
      try {
        return await dispatch('action', {
          action: 'signTransaction',
          accountIndex,
          data: transactionBytes
        })
      } catch (error) {
        logger.error(error)
        throw new Error(`Could not sign transaction: ${error}`)
      }
    },

    /**
     * Sign transaction for ledger wallet using schnorr signatures.
     * @param  {Object} obj
     * @param  {String} obj.transactionBytes Bytes of transaction.
     * @param  {Number} obj.accountIndex Index of wallet to sign transaction for.
     * @return {(String|Boolean)}
     */
    async signTransactionWithSchnorr ({ dispatch }, { transactionBytes, accountIndex } = {}) {
      try {
        return await dispatch('action', {
          action: 'signTransactionWithSchnorr',
          accountIndex,
          data: transactionBytes
        })
      } catch (error) {
        logger.error(error)
        throw new Error(`Could not sign transaction: ${error}`)
      }
    },

    /**
     * Sign message for ledger wallet using ecdsa signatures.
     * @param  {Object} obj
     * @param  {Buffer} obj.messageBytes Bytes to sign.
     * @param  {Number} obj.accountIndex Index of wallet to sign transaction for.
     * @return {Promise<string>}
     */
    async signMessage ({ dispatch }, { messageBytes, accountIndex } = {}) {
      try {
        return await dispatch('action', {
          action: 'signMessage',
          accountIndex,
          data: messageBytes
        })
      } catch (error) {
        logger.error(error)
        throw new Error(`Could not sign message: ${error}`)
      }
    },

    /**
     * Sign message for ledger wallet using schnorr signatures.
     * @param  {Object} obj
     * @param  {String} obj.messageBytes Bytes to sign.
     * @param  {Number} obj.accountIndex Index of wallet to sign transaction for.
     * @return {(String|Boolean)}
     */
    async signMessageWithSchnorr ({ dispatch }, { messageBytes, accountIndex } = {}) {
      try {
        return await dispatch('action', {
          action: 'signMessageWithSchnorr',
          accountIndex,
          data: messageBytes
        })
      } catch (error) {
        logger.error(error)
        throw new Error(`Could not sign message: ${error}`)
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
      if (action !== 'getVersion' && (accountIndex === undefined || !Number.isFinite(accountIndex))) {
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
        async getWallet () {
          const publicKey = await ledgerService.getPublicKey(path)
          const network = rootGetters['session/network']

          return {
            address: Identities.Address.fromPublicKey(publicKey, network.version),
            publicKey
          }
        },
        async getAddress () {
          const publicKey = await ledgerService.getPublicKey(path)
          const network = rootGetters['session/network']

          return Identities.Address.fromPublicKey(publicKey, network.version)
        },
        async getPublicKey () {
          return ledgerService.getPublicKey(path)
        },
        async signTransaction () {
          return ledgerService.signTransaction(path, data)
        },
        async signTransactionWithSchnorr () {
          return ledgerService.signTransactionWithSchnorr(path, data)
        },
        async signMessage () {
          return ledgerService.signMessage(path, data)
        },
        async signMessageWithSchnorr () {
          return ledgerService.signMessageWithSchnorr(path, data)
        },
        async getVersion () {
          return ledgerService.getVersion()
        }
      }

      if (!Object.prototype.hasOwnProperty.call(actions, action)) {
        throw new Error('Action does not exist')
      }

      try {
        const response = await actions[action]()

        if (response === null) {
          await dispatch('disconnect')
          throw new Error('Ledger disconnected')
        }

        return response
      } catch (error) {
        await dispatch('disconnect')
        throw new Error('Ledger disconnected')
      }
    }
  }
}
