import pluginManager from '@/services/plugin-manager'

export default {
  install (Vue) {
    pluginManager.setVue(Vue.extend())
    Vue.prototype.$plugins = pluginManager
  }
}
