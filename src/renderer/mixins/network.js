export default {
  methods: {
    /**
     * Open the explorer from current network.
     *
     * @param {String} path
     * @param {String} param
     */
    network_openExplorer (path, param) {
      const network = this.session_network

      if (!network) {
        throw new Error('[network_openExplorer] No active network.')
      }

      const { explorer } = network
      const uri = `${explorer}/${path}/${param}`

      this.electron_openExternal(uri)
    }
  }
}
