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
        availableRelease: function (state) { return state.availableRelease; },
        hasAvailableRelease: function (state) { return state.availableRelease.version !== undefined; }
    },
    mutations: {
        SET_AVAILABLE_RELEASE: function (state, release) {
            state.availableRelease = release;
        }
    },
    actions: {
        setAvailableRelease: function (_a, value) {
            var commit = _a.commit;
            commit('SET_AVAILABLE_RELEASE', value);
        }
    }
};
//# sourceMappingURL=updater.js.map