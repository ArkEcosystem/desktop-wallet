import crypto from 'crypto'
import BaseModule from '../base'
import ProfileModel from '@/models/profile'

export default new BaseModule(ProfileModel, {
  getters: {
    doesExist: state => checkName => {
      const normalize = (name) => name.toLowerCase().replace(/^\s+|\s+$/g, '')
      checkName = normalize(checkName)

      return state.all.find(profile => normalize(profile.name) === checkName)
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
    delete ({ commit, dispatch, rootGetters }, { id }) {
      const wallets = rootGetters['wallet/byProfileId'](id)
      wallets.forEach(async wallet => {
        await dispatch('wallet/delete', wallet, { root: true })
      })
      commit('DELETE', id)
    }
  }
})
