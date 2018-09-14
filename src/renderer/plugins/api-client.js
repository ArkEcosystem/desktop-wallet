import Client from '@arkecosystem/client'

export const client = new Client('http://') // Initial state

export default {
  install (Vue) {
    Vue.prototype.$client = client
  }
}
