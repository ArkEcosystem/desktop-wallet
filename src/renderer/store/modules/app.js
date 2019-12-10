export default {
  namespaced: true,

  state: {
    latestAppliedMigration: null,
    pinCode: null,
    hasAcceptedBlacklistDisclaimer: false,
    hasSeenIntroduction: false,
    showVotingExplanation: true,
    isScreenshotProtectionEnabled: null
  },

  getters: {
    latestAppliedMigration: state => state.latestAppliedMigration,
    pinCodeEnabled: state => !!state.pinCode,
    pinCode: state => state.pinCode,
    hasAcceptedBlacklistDisclaimer: state => state.hasAcceptedBlacklistDisclaimer,
    hasSeenIntroduction: state => state.hasSeenIntroduction,
    showVotingExplanation: state => state.showVotingExplanation,
    isScreenshotProtectionEnabled: state => state.isScreenshotProtectionEnabled
  },

  mutations: {
    SET_LATEST_APPLIED_MIGRATION (state, version) {
      state.latestAppliedMigration = version
    },
    SET_PIN_CODE (state, pinCode) {
      state.pinCode = pinCode
    },
    SET_HAS_ACCEPTED_BLACKLIST_DISCLAIMER (state, accepted) {
      state.hasAcceptedBlacklistDisclaimer = accepted
    },
    SET_HAS_SEEN_INTRODUCTION (state, seen) {
      state.hasSeenIntroduction = seen
    },
    SET_SHOW_VOTING_EXPLANATION (state, showVotingExplanation) {
      state.showVotingExplanation = showVotingExplanation
    },
    SET_IS_SCREENSHOT_PROTECTION_ENABLED (state, enabled) {
      state.isScreenshotProtectionEnabled = enabled
    }
  },

  actions: {
    setLatestAppliedMigration ({ commit }, value) {
      commit('SET_LATEST_APPLIED_MIGRATION', value)
    },
    setPinCode ({ commit }, value) {
      commit('SET_PIN_CODE', value)
    },
    setHasAcceptedBlacklistDisclaimer ({ commit }, value) {
      commit('SET_HAS_ACCEPTED_BLACKLIST_DISCLAIMER', value)
    },
    setHasSeenIntroduction ({ commit }, value) {
      commit('SET_HAS_SEEN_INTRODUCTION', value)
    },
    setVotingExplanation ({ commit }, value) {
      commit('SET_SHOW_VOTING_EXPLANATION', value)
    },
    setIsScreenshotProtectionEnabled ({ commit }, value) {
      commit('SET_IS_SCREENSHOT_PROTECTION_ENABLED', value)
    }
  }
}
