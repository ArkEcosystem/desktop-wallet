import { Environment, ProfileRepository } from "@arkecosystem/platform-sdk-profiles";
import Vue from "vue";

import { HttpClient } from "@/support/services/http";

declare module "vue/types/vue" {
	interface Vue {
		// Vue
		$eventBus: Vue;

		// Platform SDK
		$env: Environment;
		$profiles: ProfileRepository;
		$http: HttpClient;
	}
}
