import releaseService from '@/services/release'

export default {
  namespaced: true,

  state: {
    pinCode: null
  },

  getters: {
    latestReleaseVersion: state => state.latestReleaseVersion,
    pinCodeEnabled: state => !!state.pinCode,
    pinCode: state => state.pinCode
  },

  mutations: {
    SET_LATEST_RELEASE_VERSION (state, version) {
      state.latestReleaseVersion = version
    },
    SET_PIN_CODE (state, pinCode) {
      state.pinCode = pinCode
    }
  },

  actions: {
    async checkNewVersion ({ commit }) {
      const latestRelease = await releaseService.fetchLatestRelease()
      // eslint-disable-next-line camelcase
      commit('SET_LATEST_RELEASE_VERSION', latestRelease.tag_name)
    },
    setPinCode ({ commit }, value) {
      commit('SET_PIN_CODE', value)
    }
  }
}
