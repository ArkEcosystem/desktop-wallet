import "reflect-metadata";
import "./registerComponentHooks";

import logger from "electron-log";
import PortalVue from "portal-vue";
import VTooltip from "v-tooltip";
import Vue from "vue";
import VueGoodTablePlugin from "vue-good-table";
import VueVuelidateJsonschema from "vue-vuelidate-jsonschema";
import Vuelidate from "vuelidate";

import alertEvents from "@/plugins/alert-events";
import apiClient from "@/plugins/api-client";
import env from "@/plugins/env";
import eventBus from "@/plugins/event-bus";
import pluginManager from "@/plugins/plugin-manager";
import synchronizer from "@/plugins/synchronizer";

import App from "./App";
import directives from "./directives";
import filters from "./filters";
import i18n from "./i18n";
import mixins from "./mixins";
import router from "./router";
import store from "./store";

// Must be first to contain an empty Vue instance
Vue.use(pluginManager);

Vue.config.productionTip = false;
Vue.logger = Vue.prototype.$logger = logger;
Vue.prototype.$eventBus = eventBus;

Vue.use(filters);
Vue.use(directives);
Vue.use(VueVuelidateJsonschema);
Vue.use(Vuelidate);
Vue.use(VueGoodTablePlugin);
Vue.use(VTooltip, {
	defaultHtml: false,
	defaultContainer: "#app",
});
Vue.use(alertEvents);
Vue.use(apiClient);
Vue.use(env);
Vue.use(synchronizer);
Vue.use(PortalVue);

Vue.mixin(mixins);

/* eslint-disable no-new */
new Vue({
	components: { App },
	i18n,
	router,
	store,
	template: "<App/>",
}).$mount("#app");
