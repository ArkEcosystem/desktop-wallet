import ledgerService from '@/services/ledger-service'
import eventBus from '@/plugins/event-bus'
import { crypto } from '@arkecosystem/crypto'
import logger from 'electron-log'

export default {
  namespaced: true,

  state: {
    slip44: null,
    connected: false,
    connectionTimer: null,
    wallets: []
  },

  getters: {
    isConnected: state => state.connected,
    wallets: state => Object.values(state.wallets),
    wallet: state => (address) => {
      if (!state.wallets[address]) {
        return null
      }

      return state.wallets[address]
    }
  },

  mutations: {
    SET_SLIP44 (state, slip44) {
      if (!slip44 || !Number.isFinite(slip44)) {
        throw new Error('Slip44 must be a number greater than 0')
      }

      state.slip44 = slip44
    },
    SET_CONNECTION_TIMER (state, connectionTimer) {
      state.connectionTimer = connectionTimer
    },
    SET_CONNECTED (state, connected) {
      state.connected = connected
    },
    SET_WALLETS (state, wallets) {
      state.wallets = wallets
    }
  },

  actions: {
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
      eventBus.$emit('ledger:connected')
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
      eventBus.$emit('ledger:disconnected')
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
      if (state.connected && !await dispatch('checkConnected')) {
        await dispatch('disconnect')
        delay = 2000
      }

      if (!isTimer && state.connectionTimer) {
        return
      }

      if (!state.connected) {
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
      if (!state.connected) {
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
     * @return {Object[]}
     */
    async reloadWallets ({ commit, dispatch }) {
      try {
        const wallets = []
        for (let i = 0; ; i++) {
          let isColdWallet = false
          const ledgerAddress = await dispatch('getAddress', i)
          let wallet
          try {
            wallet = await this._vm.$client.fetchWallet(ledgerAddress)
          } catch (error) {
            logger.error(error)
            const message = error.response ? error.response.data.message : error.message
            if (message !== 'Wallet not found') {
              throw error
            }
          }
          if (!wallet) {
            isColdWallet = true
            wallet = {
              address: ledgerAddress,
              balance: 0
            }
          }

          wallets[ledgerAddress] = Object.assign(wallet, {
            isLedger: true,
            isSendingEnabled: true,
            name: `Ledger ${i + 1}`,
            passphrase: null,
            profileId: null,
            id: ledgerAddress,
            publicKey: await dispatch('getPublicKey', i)
          })

          if (isColdWallet) {
            commit('SET_WALLETS', wallets)
            eventBus.$emit('ledger:wallets-updated', wallets)

            return wallets
          }
        }
      } catch (error) {
        logger.error(error)
      }
      commit('SET_WALLETS', [])
      eventBus.$emit('ledger:wallets-updated', [])

      return []
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
      }

      return false
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
      }

      return false
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
      }

      return false
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
      if (accountIndex !== undefined && !Number.isFinite(accountIndex)) {
        throw new Error('accountIndex must be a Number')
      }

      if (!state.connected) {
        await dispatch('ensureConnection')
        if (!state.connected) {
          throw new Error('Ledger not connected')
        }
      }

      const path = `44'/${state.slip44}'/${accountIndex || 0}'/0/0`
      const actions = {
        getAddress: async () => {
          const response = await ledgerService.getAddress(path)
          const publicKey = response.publicKey
          const network = rootGetters['session/network']

          return crypto.getAddress(publicKey, network.version)
        },
        getPublicKey: async () => {
          const response = await ledgerService.getAddress(path)

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
