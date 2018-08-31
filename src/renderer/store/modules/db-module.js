import _ from 'lodash'
import db from '@/store/db/instance'

const includes = (objects, find) => objects.map(a => a.id).includes(find.id)

/**
 * This module wraps db operations with actions and automatically performs the
 * mutations.
 */
class DbModule {
  /**
   * @param {(String|Object)} options - name of the module or { name, modelType }
   * @param {Object} config
   */
  constructor (name, config = {}) {
    let modelType

    if (_.isString(name)) {
      modelType = name
    } else {
      ({ name, modelType } = name)
    }

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
          if (includes(state.all, model)) {
            throw new Error(`Cannot create \`${model.id}\`. It already exists on the state`)
          }
          state.all.push(model)
        },
        STORE (state, model) {
          state.all = _.unionBy([model, ...state.all], 'id')
        },
        UPDATE (state, model) {
          if (!includes(state.all, model)) {
            throw new Error(`Cannot update \`${model.id}\`. It does not exist on the state`)
          }
          state.all = _.unionBy([model, ...state.all], 'id')
        },
        DELETE (state, model) {
          const index = _.findIndex(state.all, { id: model.id })
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
        all: state => state.all,
        /**
         * Returns a specific Model by its id
         * @param {String} id
         * @return {Model}
         */
        byId: state => id => state.all.find(model => model.id === id)
      },
      actions: {
        /**
         * Loads all the announcements from the db.
         */
        async load ({ commit }) {
          const models = await db.getAllByType(modelType)
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
