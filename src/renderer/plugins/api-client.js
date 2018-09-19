import Client from '@arkecosystem/client'

export const client = new Client('http://') // Initial state

export const vuexClient = (store) => {
  store.watch(
    (_, getters) => getters['session/currentProfile'],
    (profile) => {
      if (!profile) return

      store.dispatch('session/setClient', profile.networkId)
    },
    { immediate: true }
  )
}

export default {
  install (Vue) {
    Vue.prototype.$client = client
  }
}
