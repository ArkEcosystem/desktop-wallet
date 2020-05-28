import { Environment } from "@arkecosystem/platform-sdk-profiles";
import Vue from "vue";

import { HttpClient } from "@/services/http";

declare module "vue/types/vue" {
	interface Vue {
		// Vue
		$eventBus: Vue;
		$v: any;

		// Platform SDK
		$env: Environment;
		$http: HttpClient;
	}
}
