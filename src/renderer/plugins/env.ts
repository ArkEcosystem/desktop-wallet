import { Environment } from "@arkecosystem/platform-sdk-profiles";

export default {
	install(Vue) {
		let instance: Environment;

		Object.defineProperty(Vue.prototype, "$env", {
			get() {
				if (!instance) {
					instance = new Environment({ storage: "indexeddb" });
				}

				return instance;
			},
		});
	},
};
