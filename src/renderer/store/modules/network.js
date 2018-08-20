import * as types from '../mutation-types'

export default {
  namespaced: true,

  state: {
    defaults: []
  },

  mutations: {
    [types.SET_NETWORK_DEFAULTS] (state, value) {
      state.defaults = value
    }
  },

  actions: {
    setDefaults ({ commit }, value) {
      commit(types.SET_NETWORK_DEFAULTS, value)
    }
  },

  getters: {
    defaults: state => state.defaults
  }
}
