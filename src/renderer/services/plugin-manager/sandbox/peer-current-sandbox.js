export function create (walletApi, app) {
  return () => {
    walletApi.peers = {
      current: {
        get: async (url, timeout = 3000) => {
          return (await app.$client.client.get(url, { timeout })).body
        },

        post: async (url, timeout = 3000) => {
          return (await app.$client.client.post(url, { timeout })).body
        }
      }
    }
  }
}
