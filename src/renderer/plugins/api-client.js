import Client from '@arkecosystem/client'

export const client = new Client('http://') // Initial state

export const vuexClient = (store) => {
  store.watch(
    (_, getters) => getters['session/currentProfile'],
    profile => {
      if (!profile) return
      const { server, apiVersion } = store.getters['network/byId'](profile.network)

      client.setVersion(apiVersion)
      client.setConnection(server)
      client.http.headers['API-Version'] = apiVersion
    },
    { immediate: true }
  )
}

export default {
  install (Vue) {
    Vue.prototype.$client = client
  }
}
