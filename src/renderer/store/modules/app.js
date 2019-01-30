import releaseService from '@/services/release'

export default {
  namespaced: true,

  state: {
    latestAppliedMigration: null,
    pinCode: null,
    hasSeenIntroduction: false,
    showVotingExplanation: true
  },

  getters: {
    latestAppliedMigration: state => state.latestAppliedMigration,
    latestReleaseVersion: state => state.latestReleaseVersion,
    pinCodeEnabled: state => !!state.pinCode,
    pinCode: state => state.pinCode,
    hasSeenIntroduction: state => state.hasSeenIntroduction,
    showVotingExplanation: state => state.showVotingExplanation
  },

  mutations: {
    SET_LATEST_APPLIED_MIGRATION (state, version) {
      state.latestAppliedMigration = version
    },
    SET_LATEST_RELEASE_VERSION (state, version) {
      state.latestReleaseVersion = version
    },
    SET_PIN_CODE (state, pinCode) {
      state.pinCode = pinCode
    },
    SET_HAS_SEEN_INTRODUCTION (state, seen) {
      state.hasSeenIntroduction = seen
    },
    SET_SHOW_VOTING_EXPLANATION (state, showVotingExplanation) {
      state.showVotingExplanation = showVotingExplanation
    }
  },

  actions: {
    async checkNewVersion ({ commit }) {
      const latestRelease = await releaseService.fetchLatestRelease()
      // eslint-disable-next-line camelcase
      commit('SET_LATEST_RELEASE_VERSION', latestRelease.tag_name)
    },
    setLatestAppliedMigration ({ commit }, value) {
      commit('SET_LATEST_APPLIED_MIGRATION', value)
    },
    setPinCode ({ commit }, value) {
      commit('SET_PIN_CODE', value)
    },
    setHasSeenIntroduction ({ commit }, value) {
      commit('SET_HAS_SEEN_INTRODUCTION', value)
    },
    setVotingExplanation ({ commit }, value) {
      commit('SET_SHOW_VOTING_EXPLANATION', value)
    }
  }
}
