import pluginManager from '@/services/plugin-manager'
import PluginWrapper from '@/components/Plugin/PluginWrapper'

export default {
  install (Vue) {
    pluginManager.setVue(Vue.extend())
    Vue.component('Ark', PluginWrapper)
    Vue.prototype.$plugins = pluginManager
  }
}
