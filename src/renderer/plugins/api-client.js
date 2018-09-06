import Client from '@arkecosystem/client'

export const client = new Client('http://') // Initial state

// Listen for changes in the current profile
// And update the client with the network config
export default (store) => {
  store.watch(
    (_, getters) => getters['session/currentProfile'],
    profile => {
      if (!profile) return

      const { network } = profile
      const { server, apiVersion } = store.getters['network/byId'](network)

      client.setConnection(server)
      client.setVersion(apiVersion)
    },
    { immediate: true }
  )
}
