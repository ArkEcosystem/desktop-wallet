import pluginManager from '@/services/plugin-manager'

export default {
  install (Vue) {
    Vue.prototype.$plugins = pluginManager
  }
}
