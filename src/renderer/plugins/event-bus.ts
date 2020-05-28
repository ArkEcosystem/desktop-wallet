import Vue from "vue";

export const eventBus = new Vue();

export default {
	install(Vue) {
		Vue.prototype.$eventBus = eventBus;
	},
};
