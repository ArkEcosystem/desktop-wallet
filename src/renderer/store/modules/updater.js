export default {
  namespaced: true,

  state: {
    cancellationToken: undefined,
    isDownloading: false,
    availableRelease: {
      releaseDate: undefined,
      releaseName: undefined,
      releaseNotes: undefined,
      version: undefined
    }
  },

  getters: {
    cancellationToken: state => state.cancellationToken,
    availableRelease: state => state.availableRelease,
    hasAvailableRelease: state => state.availableRelease.version !== undefined
  },

  mutations: {
    SET_CANCELLATION_TOKEN (state, token) {
      state.cancellationToken = token
    },
    SET_AVAILABLE_RELEASE (state, release) {
      state.availableRelease = release
    }
  },

  actions: {
    setCancellationToken ({ commit }, value) {
      commit('SET_CANCELLATION_TOKEN', value)
    },
    setAvailableRelease ({ commit }, value) {
      commit('SET_AVAILABLE_RELEASE', value)
    }
  }
}
