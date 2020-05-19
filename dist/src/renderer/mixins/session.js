import logger from 'electron-log';
export default {
    computed: {
        session_currency: function () {
            return this.$store.getters['session/currency'];
        },
        session_hasDarkTheme: function () {
            var theme = this.$store.getters['session/theme'];
            if (['light', 'dark'].includes(theme)) {
                return theme === 'dark';
            }
            var pluginThemes = this.$store.getters['plugin/themes'];
            if (pluginThemes[theme]) {
                return pluginThemes[theme].darkMode;
            }
            logger.error("Theme \"" + theme + "\" was not found");
            // Fallback to the `light` theme
            return false;
        },
        session_network: function () {
            return this.$store.getters['session/network'];
        },
        session_profile: function () {
            return this.$store.getters['session/profile'];
        }
    }
};
//# sourceMappingURL=session.js.map