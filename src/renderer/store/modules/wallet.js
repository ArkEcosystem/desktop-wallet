import { unionBy, uniqBy } from 'lodash'
import WalletModel from '@/models/wallet'
import Vue from 'vue'

const includes = (objects, find) => objects.map(a => a.id).includes(find.id)
const includesMessage = (objects, find) => objects.map(a => a.timestamp).includes(find.timestamp)
const sanitizeWallet = (wallet) => {
  if (wallet.attributes && wallet.attributes.business && wallet.attributes.business.businessAsset) {
    wallet.business = wallet.attributes.business.businessAsset
    wallet.business.resigned = !!wallet.attributes.business.resigned
  }

  return wallet
}

/**
 * Internally the wallets are stored aggregated by `profileId`
 */
export default {
  namespaced: true,

  state: {
    wallets: {},
    ledgerNames: {},
    secondaryButtonsVisible: false,
    signedMessages: {}
  },

  getters: {
    byAddress: (state, _, __, rootGetters) => address => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.wallets[profileId]) {
        return null
      }

      return state.wallets[profileId].find(wallet => wallet.address === address)
    },

    byName: (state, _, __, rootGetters) => name => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.wallets[profileId]) {
        return null
      }

      return state.wallets[profileId].find(wallet => wallet.name === name)
    },

    byProfileId: (state) => profileId => {
      if (!state.wallets[profileId]) {
        return []
      }

      return state.wallets[profileId].filter(wallet => !wallet.isContact)
    },

    publicByProfileId: (state, _, __, rootGetters) => (profileId, getContacts = false) => {
      const profileWallets = state.wallets[profileId] || []
      const ledgerWallets = rootGetters['ledger/byProfileId'](profileId)

      const wallets = uniqBy([
        ...ledgerWallets,
        ...profileWallets
      ], 'address')

      if (!wallets.length) {
        return []
      }

      return wallets.filter(wallet => {
        return wallet.isContact === getContacts || wallet.isContact === undefined
      }).map(wallet => ({
        address: wallet.address,
        balance: wallet.balance,
        name: wallet.name,
        publicKey: wallet.publicKey,
        vote: wallet.vote,
        ...(wallet.isLedger && { isLedger: wallet.isLedger })
      }))
    },

    contactsByProfileId: (state) => profileId => {
      if (!state.wallets[profileId]) {
        return []
      }

      return state.wallets[profileId].filter(wallet => wallet.isContact)
    },

    ledgerNameByAddress: (state, _, __, rootGetters) => address => {
      const profileId = rootGetters['session/profileId']
      if (!state.ledgerNames[profileId]) {
        return null
      }

      return state.ledgerNames[profileId][address]
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
    UPDATE_BULK (state, wallets) {
      const profileId = wallets[0].profileId
      wallets.forEach(wallet => {
        if (profileId !== wallet.profileId) {
          throw new Error(`Updating wallets of different profile is not supported ('${profileId}' != '${wallet.profileId}')`)
        }
        if (!includes(state.wallets[profileId], wallet)) {
          throw new Error(`Cannot update wallet '${wallet.id}' - it does not exist on the state`)
        }
      })
      state.wallets[profileId] = unionBy([...wallets, ...state.wallets[profileId]], 'id')
    },
    DELETE (state, wallet) {
      if (state.wallets[wallet.profileId]) {
        const index = state.wallets[wallet.profileId].findIndex(profileWallet => profileWallet.id === wallet.id)
        if (index === -1) {
          throw new Error(`Cannot delete wallet '${wallet.id}' - it does not exist on the state`)
        }
        state.wallets[wallet.profileId].splice(index, 1)
      }
    },
    SET_LEDGER_NAME (state, { address, name, profileId }) {
      if (!state.ledgerNames[profileId]) {
        state.ledgerNames[profileId] = {}
      }

      state.ledgerNames[profileId][address] = name
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
      if (state.signedMessages[message.address]) {
        const index = state.signedMessages[message.address].findIndex(signedMessage => signedMessage.timestamp === message.timestamp)
        if (index !== -1) {
          state.signedMessages[message.address].splice(index, 1)
        }
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
      const data = WalletModel.deserialize(sanitizeWallet(wallet))
      commit('UPDATE', data)

      return data
    },
    updateBulk ({ commit }, wallets) {
      const data = wallets.map(wallet => WalletModel.deserialize(sanitizeWallet(wallet)))
      commit('UPDATE_BULK', data)

      return data
    },
    delete ({ commit }, wallet) {
      commit('DELETE', wallet)
    },
    setLedgerName ({ commit, rootGetters }, { address, name }) {
      if (!address) {
        throw new Error('No address specified')
      }
      if (!name || !name.replace(/\s/g, '').length) {
        throw new Error('No name specified')
      }

      const profileId = rootGetters['session/profileId']
      commit('SET_LEDGER_NAME', { address, name, profileId })
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
