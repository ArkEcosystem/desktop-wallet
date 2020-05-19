import { assignIn, transform } from "lodash";

import eventBus from "./event-bus";

const triggerAlert = (alert) => eventBus.emit("alert", alert);

const types = ["error", "success", "info", "warn"];

const inject = transform(
	types,
	(result, type) => {
		result[`$${type}`] = (message, duration) => {
			triggerAlert({ message, type, duration });
		};
	},
	{},
);

export default {
	install(Vue) {
		assignIn(Vue.prototype, inject);
	},
	...inject,
};
