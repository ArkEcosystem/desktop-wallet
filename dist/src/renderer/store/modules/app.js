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
        latestAppliedMigration: function (state) { return state.latestAppliedMigration; },
        pinCodeEnabled: function (state) { return !!state.pinCode; },
        pinCode: function (state) { return state.pinCode; },
        hasAcceptedBlacklistDisclaimer: function (state) { return state.hasAcceptedBlacklistDisclaimer; },
        hasSeenIntroduction: function (state) { return state.hasSeenIntroduction; },
        showVotingExplanation: function (state) { return state.showVotingExplanation; },
        isScreenshotProtectionEnabled: function (state) { return state.isScreenshotProtectionEnabled; }
    },
    mutations: {
        SET_LATEST_APPLIED_MIGRATION: function (state, version) {
            state.latestAppliedMigration = version;
        },
        SET_PIN_CODE: function (state, pinCode) {
            state.pinCode = pinCode;
        },
        SET_HAS_ACCEPTED_BLACKLIST_DISCLAIMER: function (state, accepted) {
            state.hasAcceptedBlacklistDisclaimer = accepted;
        },
        SET_HAS_SEEN_INTRODUCTION: function (state, seen) {
            state.hasSeenIntroduction = seen;
        },
        SET_SHOW_VOTING_EXPLANATION: function (state, showVotingExplanation) {
            state.showVotingExplanation = showVotingExplanation;
        },
        SET_IS_SCREENSHOT_PROTECTION_ENABLED: function (state, enabled) {
            state.isScreenshotProtectionEnabled = enabled;
        }
    },
    actions: {
        setLatestAppliedMigration: function (_a, value) {
            var commit = _a.commit;
            commit('SET_LATEST_APPLIED_MIGRATION', value);
        },
        setPinCode: function (_a, value) {
            var commit = _a.commit;
            commit('SET_PIN_CODE', value);
        },
        setHasAcceptedBlacklistDisclaimer: function (_a, value) {
            var commit = _a.commit;
            commit('SET_HAS_ACCEPTED_BLACKLIST_DISCLAIMER', value);
        },
        setHasSeenIntroduction: function (_a, value) {
            var commit = _a.commit;
            commit('SET_HAS_SEEN_INTRODUCTION', value);
        },
        setVotingExplanation: function (_a, value) {
            var commit = _a.commit;
            commit('SET_SHOW_VOTING_EXPLANATION', value);
        },
        setIsScreenshotProtectionEnabled: function (_a, value) {
            var commit = _a.commit;
            commit('SET_IS_SCREENSHOT_PROTECTION_ENABLED', value);
        }
    }
};
//# sourceMappingURL=app.js.map