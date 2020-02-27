import { merge, unionBy } from 'lodash'

const includes = (objects, find) => objects.map(a => a.id).includes(find.id)

/**
 * This module wraps db operations with actions and automatically performs the
 * mutations.
 */
export default class BaseModule {
  /**
   * @param {Object} config
   */
  constructor (modeler, config = {}) {
    const defaultConfig = {
      namespaced: true,

      state: {
        all: []
      },

      getters: {
        all: state => state.all,
        byId: state => id => state.all.find(model => model.id === id)
      },

      mutations: {
        CREATE (state, model) {
          if (includes(state.all, model)) {
            throw new Error(`Cannot create \`${model.id}\`. It already exists on the state`)
          }
          state.all.push(model)
        },

        STORE (state, model) {
          state.all = unionBy([model, ...state.all], 'id')
        },

        UPDATE (state, model) {
          if (!includes(state.all, model)) {
            throw new Error(`Cannot update \`${model.id}\`. It does not exist on the state`)
          }
          state.all = unionBy([model, ...state.all], 'id')
        },

        DELETE (state, id) {
          const index = state.all.findIndex(item => item.id === id)
          if (index === -1) {
            throw new Error(`Cannot delete \`${id}\`. It does not exist on the state`)
          }
          state.all.splice(index, 1)
        }
      },

      actions: {
        create ({ commit }, model) {
          const data = modeler.deserialize(model)
          commit('CREATE', data)
          return data
        },

        store ({ commit }, model) {
          commit('STORE', model)
        },

        update ({ commit }, model) {
          const data = modeler.deserialize(model)
          commit('UPDATE', data)
          return data
        },

        delete ({ commit }, { id }) {
          commit('DELETE', id)
        }
      }
    }

    return merge({}, defaultConfig, config)
  }
}
