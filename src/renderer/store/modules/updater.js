export default {
  namespaced: true,

  state: {
    availableRelease: {
      releaseDate: undefined,
      releaseName: undefined,
      releaseNotes: undefined,
      version: undefined
    }
  },

  getters: {
    availableRelease: state => state.availableRelease,
    hasAvailableRelease: state => state.availableRelease.version !== undefined
  },

  mutations: {
    SET_AVAILABLE_RELEASE (state, release) {
      state.availableRelease = release
    }
  },

  actions: {
    setAvailableRelease ({ commit }, value) {
      commit('SET_AVAILABLE_RELEASE', value)
    }
  }
}
