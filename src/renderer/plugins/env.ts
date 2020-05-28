import { Environment } from "@arkecosystem/platform-sdk-profiles";

import { httpClient } from "./http-client";

export default {
	install(Vue) {
		let instance: Environment;

		Object.defineProperty(Vue.prototype, "$env", {
			get() {
				if (!instance) {
					instance = new Environment({ httpClient, storage: "indexeddb" });
				}

				return instance;
			},
		});
	},
};
