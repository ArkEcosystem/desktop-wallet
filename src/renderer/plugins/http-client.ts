import { HttpClient } from "@/services/http";

export const httpClient = new HttpClient();

export default {
	install(Vue) {
		Vue.prototype.$http = httpClient;
	},
};
