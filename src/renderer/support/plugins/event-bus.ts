import Emittery from "emittery";

export const eventBus = new Emittery();

export default {
	install(Vue) {
		Vue.prototype.$eventBus = eventBus;
	},
};
