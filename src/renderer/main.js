import "reflect-metadata";
import "./registerComponentHooks";

import logger from "electron-log";
import PortalVue from "portal-vue";
import VTooltip from "v-tooltip";
import Vue from "vue";
import VueGoodTablePlugin from "vue-good-table";

import App from "@/app/App";
import i18n from "@/app/i18n";
import router from "@/app/router";
import store from "@/app/store";
import directives from "@/support/directives";
import filters from "@/support/filters";
import mixins from "@/support/mixins";
import env from "@/support/plugins/env";
import eventBus from "@/support/plugins/event-bus";
import http from "@/support/plugins/http-client";

Vue.config.productionTip = false;
Vue.logger = Vue.prototype.$logger = logger;

// Platform SDK
Vue.use(env);
Vue.use(http);

// Vue & App
Vue.use(filters);
Vue.use(directives);
Vue.use(VueGoodTablePlugin);
Vue.use(VTooltip, {
	defaultHtml: false,
	defaultContainer: "#app",
});
Vue.use(eventBus);
Vue.use(PortalVue);

Vue.mixin(mixins);

const app = new Vue({
	components: {
		App,
	},
	i18n,
	router,
	store,
	template: "<App/>",
});

store.$app = app;

app.$mount("#app");
