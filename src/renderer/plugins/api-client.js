import Client from '@/services/client'

export const client = new Client()

export default {
  install (Vue) {
    Vue.prototype.$client = client
  }
}
