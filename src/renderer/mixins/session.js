export default {
  computed: {
    session_network () {
      return this.$store.getters['session/network']
    },
    session_profile () {
      return this.$store.getters['session/profile']
    }
  }
}
