export default {
  computed: {
    session_currency () {
      return this.$store.getters['session/currency']
    },
    session_hasDarkTheme () {
      return this.$store.getters['session/hasDarkTheme']
    },
    session_network () {
      return this.$store.getters['session/network']
    },
    session_profile () {
      return this.$store.getters['session/profile']
    }
  }
}
