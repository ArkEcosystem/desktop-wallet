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

      const pluginThemes = this.$store.getters['session/theme']

      if (pluginThemes.length && pluginThemes[theme]) {
        return pluginThemes[theme].darkMode
      }

      throw new Error(`Theme "${theme}" was not found`)
    },
    session_network () {
      return this.$store.getters['session/network']
    },
    session_profile () {
      return this.$store.getters['session/profile']
    }
  }
}
