import { Environment } from "@arkecosystem/platform-sdk-profiles";

import { httpClient } from "./http-client";

const env: Environment = new Environment({ httpClient, storage: "indexeddb" });

export default {
	install(Vue) {
		Vue.prototype.$env = env;
	},
};
