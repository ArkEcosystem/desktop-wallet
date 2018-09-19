import crypto from 'crypto'
import BaseModule from '../base'
import ProfileModel from '@/models/profile'

export default new BaseModule(ProfileModel, {
  actions: {
    /**
     * This default action is overridden to generate a random unique ID
     */
    create ({ commit }, model) {
      model.id = crypto.randomBytes(12).toString('base64')

      const data = ProfileModel.deserialize(model)

      commit('CREATE', data)
      return data
    }
  }
})
