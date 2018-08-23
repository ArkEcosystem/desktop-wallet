import _ from 'lodash'
import db from '@/store/db/instance'

/**
 * This module wraps db operations with actions and automatically performs the
 * mutations.
 */
class DbModule {
  constructor (type, config) {
    const defaultConfig = {
      namespaced: true,
      state: {
        /**
         * This Array contains all the Models of this Vuex module.
         */
        all: []
      },
      mutations: {
        CREATE (state, model) {
          if (_.includes(state.all, model)) {
            throw new Error(`Cannot create \`${model.id}\`. It already exists on the state`)
          }
          state.all.push(model)
        },
        STORE (state, model) {
          state.all = _.union(state.all, [model])
        },
        UPDATE (state, model) {
          if (!_.includes(state.all, model)) {
            throw new Error(`Cannot update \`${model.id}\`. It does not exist on the state`)
          }
          state.all = _.union(state.all, [model])
        },
        DELETE (state, model) {
          const index = state.all.indexOf(model.id)
          if (index === -1) {
            throw new Error(`Cannot delete \`${model.id}\`. It does not exist on the state`)
          }
          state.all.splice(index, 1)
        }
      },
      getters: {
        /**
         * Returns all the Models of this type
         * @return {Array}
         */
        all: state => state.all
      },
      actions: {
        /**
         * Loads all the announcements from the db.
         */
        async load ({ commit }) {
          const models = await db.getAll(type)
          models.forEach(model => {
            commit('STORE', model)
          })
        },
        async create ({ commit }, model) {
          await db.create(model)
          commit('CREATE', model)
        },
        async store ({ commit }, model) {
          await db.store(model)
          commit('STORE', model)
        },
        async update ({ commit }, model) {
          await db.update(model)
          commit('UPDATE', model)
        },
        async delete ({ commit }, model) {
          await db.delete(model)
          commit('DELETE', model)
        }
      }
    }

    return _.merge({}, defaultConfig, config)
  }
}

export default DbModule
