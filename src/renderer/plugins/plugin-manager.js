import PluginWrapper from "@/components/Plugin/PluginWrapper";
import pluginManager from "@/services/plugin-manager";

export default {
	install(Vue) {
		Vue.component("Ark", PluginWrapper);
		pluginManager.setVue(Vue.extend());
		Vue.prototype.$plugins = pluginManager;
	},
};
