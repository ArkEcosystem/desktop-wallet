import pluginManager from '@/services/plugin-manager';
import PluginWrapper from '@/components/Plugin/PluginWrapper';
export default {
    install: function (Vue) {
        Vue.component('Ark', PluginWrapper);
        pluginManager.setVue(Vue.extend());
        Vue.prototype.$plugins = pluginManager;
    }
};
//# sourceMappingURL=plugin-manager.js.map