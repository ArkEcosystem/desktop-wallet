import { findIndex, unionBy } from 'lodash'
import WalletModel from '@/models/wallet'
import Vue from 'vue'

const includes = (objects, find) => objects.map(a => a.id).includes(find.id)
const includesMessage = (objects, find) => objects.map(a => a.timestamp).includes(find.timestamp)

/**
 * Internally the wallets are stored aggregated by `profileId``
 */
export default {
  namespaced: true,

  state: {
    wallets: {},
    secondaryButtonsVisible: false,
    signedMessages: {}
  },

  getters: {
    byAddress: (state, _, __, rootGetters) => address => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.wallets[profileId]) {
        return []
      }

      return state.wallets[profileId].find(wallet => wallet.address === address)
    },

    byName: (state, _, __, rootGetters) => name => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.wallets[profileId]) {
        return []
      }

      return state.wallets[profileId].find(wallet => wallet.name === name)
    },

    byProfileId: (state, _, __, rootGetters) => profileId => {
      if (!state.wallets[profileId]) {
        return []
      }

      return state.wallets[profileId].filter(wallet => !wallet.isContact)
    },

    contactsByProfileId: (state, _, __, rootGetters) => profileId => {
      if (!state.wallets[profileId]) {
        return []
      }

      return state.wallets[profileId].filter(wallet => wallet.isContact)
    },

    secondaryButtonsVisible: state => state.secondaryButtonsVisible,

    signedMessages: state => address => {
      if (!state.signedMessages[address]) {
        return []
      }

      return state.signedMessages[address]
    }
  },

  mutations: {
    CREATE (state, wallet) {
      if (!state.wallets[wallet.profileId]) {
        Vue.set(state.wallets, wallet.profileId, [])
      }

      if (includes(state.wallets[wallet.profileId], wallet)) {
        throw new Error(`Cannot create wallet '${wallet.id}' - it already exists`)
      }

      state.wallets[wallet.profileId].push(wallet)
    },
    STORE (state, wallet) {
      if (!state.wallets[wallet.profileId]) {
        Vue.set(state.wallets, wallet.profileId, [])
      }
      state.wallets[wallet.profileId] = unionBy([wallet, ...state.wallets[wallet.profileId]], 'id')
    },
    UPDATE (state, wallet) {
      if (!includes(state.wallets[wallet.profileId], wallet)) {
        throw new Error(`Cannot update wallet '${wallet.id}' - it does not exist on the state`)
      }
      state.wallets[wallet.profileId] = unionBy([wallet, ...state.wallets[wallet.profileId]], 'id')
    },
    DELETE (state, wallet) {
      const index = findIndex(state.wallets[wallet.profileId], { id: wallet.id })
      if (index === -1) {
        throw new Error(`Cannot delete wallet '${wallet.id}' - it does not exist on the state`)
      }
      state.wallets[wallet.profileId].splice(index, 1)
    },
    SET_SECONDARY_BUTTON (state, visibility) {
      state.secondaryButtonsVisible = visibility
    },
    ADD_SIGNED_MESSAGE (state, message) {
      if (!state.signedMessages[message.address]) {
        state.signedMessages[message.address] = []
      }
      if (!includesMessage(state.signedMessages[message.address], message)) {
        state.signedMessages[message.address].push(message)
      }
    },
    DELETE_SIGNED_MESSAGE (state, message) {
      const index = findIndex(state.signedMessages[message.address], { timestamp: message.timestamp })
      if (index !== -1) {
        state.signedMessages[message.address].splice(index, 1)
      }
    }
  },

  actions: {
    create ({ commit }, wallet) {
      const data = WalletModel.deserialize(wallet)
      commit('CREATE', data)

      return data
    },
    store ({ commit }, wallets) {
      commit('STORE', wallets)
    },
    update ({ commit }, wallet) {
      const data = WalletModel.deserialize(wallet)
      commit('UPDATE', data)

      return data
    },
    delete ({ commit }, wallet) {
      commit('DELETE', wallet)
    },
    setSecondaryButtonsVisible ({ commit }, visibility) {
      commit('SET_SECONDARY_BUTTON', visibility)
    },
    addSignedMessage ({ commit }, message) {
      commit('ADD_SIGNED_MESSAGE', message)
    },
    deleteSignedMessage ({ commit }, message) {
      commit('DELETE_SIGNED_MESSAGE', message)
    }
  }
}
