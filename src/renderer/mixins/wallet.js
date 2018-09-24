export default {
  computed: {
    wallet_fromRoute () {
      const params = this.$route.params
      if (!params || !params.address) return

      const address = params.address
      return this.$store.getters['wallet/byAddress'](address)
    }
  }
}
