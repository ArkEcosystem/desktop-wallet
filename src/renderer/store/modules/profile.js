import { map } from 'lodash'
import crypto from 'crypto'
import BaseModule from '../base'
import ProfileModel from '@/models/profile'

export default new BaseModule(ProfileModel, {
  getters: {
    doesExist: state => checkName => {
      const normalize = (name) => name.toLowerCase().replace(/^\s+|\s+$/g, '')
      checkName = normalize(checkName)

      return state.all.find(profile => normalize(profile.name) === checkName)
    },
    balance: (state, _, __, rootGetters) => id => {
      const wallets = rootGetters['wallet/byProfileId'](id)
      return wallets.reduce((total, wallet) => {
        return total + wallet.balance
      }, 0)
    }
  },

  actions: {
    /**
     * This default action is overridden to generate a random unique ID
     */
    create ({ commit }, model) {
      model.id = crypto.randomBytes(12).toString('base64')

      const data = ProfileModel.deserialize(model)

      commit('CREATE', data)
      return data
    },
    /**
     * This default action is overridden to remove the wallets of this profile first
     */
    async delete ({ commit, dispatch, rootGetters }, { id }) {
      // This getter returns a reference that is modified on each deletion
      const transactionIds = map(rootGetters['transaction/byProfileId'](id), 'id')
      for (const transactionId of transactionIds) {
        await dispatch('transaction/delete', { id: transactionId, profileId: id }, { root: true })
      }

      // This getter returns a reference that is modified on each deletion
      const walletIds = map(rootGetters['wallet/byProfileId'](id), 'id')
      for (const walletId of walletIds) {
        await dispatch('wallet/delete', { id: walletId, profileId: id }, { root: true })
      }

      commit('DELETE', id)
    }
  }
})
