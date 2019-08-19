import logger from 'electron-log'

export default {
  computed: {
    session_currency () {
      return this.$store.getters['session/currency']
    },
    session_hasDarkTheme () {
      const theme = this.$store.getters['session/theme']

      if (['light', 'dark'].includes(theme)) {
        return theme === 'dark'
      }

      const pluginThemes = this.$store.getters['plugin/themes']
      if (pluginThemes[theme]) {
        return pluginThemes[theme].darkMode
      }

      logger.error(`Theme "${theme}" was not found`)

      // Fallback to the `light` theme
      return false
    },
    session_network () {
      return this.$store.getters['session/network']
    },
    session_profile () {
      return this.$store.getters['session/profile']
    }
  }
}
