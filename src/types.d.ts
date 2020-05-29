import { Environment } from "@arkecosystem/platform-sdk-profiles";
import Vue from "vue";

import { HttpClient } from "@/support/services/http";

declare module "vue/types/vue" {
	interface Vue {
		// Vue
		$eventBus: Vue;
		$v: any;

		// Platform SDK
		$env: Environment;
		$profiles: any;
		$http: HttpClient;
	}
}
