import BaseModule from '../base'
import WalletModel from '@/models/wallet'

export default new BaseModule(WalletModel, {
  state: {
    secondaryButtonsVisible: false,
    signedMessages: {}
  },

  getters: {
    byAddress: state => address => state.all.find(wallet => wallet.address === address),
    byProfileId: state => profileId => state.all.filter(wallet => !wallet.isContact && wallet.profileId === profileId),
    contactsByProfileId: state => profileId => state.all.filter(wallet => wallet.isContact && wallet.profileId === profileId),
    secondaryButtonsVisible: state => state.secondaryButtonsVisible,
    signedMessages: state => address => state.signedMessages[address]
  },

  mutations: {
    SET_SECONDARY_BUTTON (state, visibility) {
      state.secondaryButtonsVisible = visibility
    },
    ADD_SIGNED_MESSAGE (state, message) {
      if (!state.signedMessages[message.address]) {
        state.signedMessages[message.address] = {}
      }
      if (!state.signedMessages[message.address][message.timestamp]) {
        state.signedMessages[message.address][message.timestamp] = message
      }
    },
    DELETE_SIGNED_MESSAGE (state, message) {
      if (state.signedMessages[message.address] && state.signedMessages[message.address][message.address]) {
        delete state.signedMessages[message.address][message.timestamp]
      }
    }
  },

  actions: {
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
})
