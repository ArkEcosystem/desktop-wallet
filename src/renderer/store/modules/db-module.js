import _ from 'lodash'
import db from '../db'

/**
 * Base module
 */
class DbModule {
  constructor (type) {
    const TYPE = type.toUpperCase()

    const types = {}
    ;['CREATE', 'STORE', 'UPDATE', 'DELETE'].forEach(action => {
      const mutation = `${TYPE}_${action}`
      types[mutation] = mutation
    })

    return {
      namespaced: true,
      state: {},
      mutations: {
        [`${TYPE}_CREATE`] (state, { [type]: model }) {
          if (_.has(state, model.id)) {
            throw new Error(`Cannot create \`${model.id}\`. It already exists on the state`)
          }
          state[model.id] = model
        },
        [`${TYPE}_STORE`] (state, { [type]: model }) {
          state[model.id] = model
        },
        [`${TYPE}_UPDATE`] (state, { [type]: model }) {
          if (!_.has(state, model.id)) {
            throw new Error(`Cannot update \`${model.id}\`. It does not exist on the state`)
          }
          state[model.id] = model
        },
        [`${TYPE}_DELETE`] (state, { [type]: model }) {
          if (!_.has(state, model.id)) {
            throw new Error(`Cannot delete \`${model.id}\`. It does not exist on the state`)
          }
          delete state[model.id]
        }
      },
      actions: {
        async create ({ commit }, model) {
          await db.create(model)
          commit({ type: `${TYPE}_CREATE`, model })
        },
        async store ({ commit }, model) {
          await db.store(model)
          commit({ type: `${TYPE}_STORE`, model })
        },
        async update ({ commit }, model) {
          await db.update(model)
          commit({ type: `${TYPE}_UPDATE`, model })
        },
        async delete ({ commit }, model) {
          await db.delete(model)
          commit({ type: `${TYPE}_DELETE`, model })
        }
      }
    }
  }
}

export default DbModule
