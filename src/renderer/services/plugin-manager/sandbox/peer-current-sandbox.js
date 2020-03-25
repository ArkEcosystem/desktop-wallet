export function create (walletApi, app) {
  return () => {
    if (!walletApi.peers) {
      walletApi.peers = {}
    }

    walletApi.peers = {
      ...walletApi.peers,

      current: {
        get: async (url, options = {}) => {
          options.timeout || (options.timeout = 3000)

          return (await app.$client.client.get(url, options)).body
        },

        post: async (url, options = {}) => {
          options.timeout || (options.timeout = 3000)

          return (await app.$client.client.post(url, options)).body
        }
      },

      getCurrent: () => {
        return app.$store.getters['peer/current']()
      }
    }
  }
}
