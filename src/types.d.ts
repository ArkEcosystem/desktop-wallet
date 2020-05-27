import { Environment } from "@arkecosystem/platform-sdk-profiles";
import Vue from "vue";

declare module "vue/types/vue" {
	interface Vue {
		$env: Environment;
		$eventBus: Vue;
		$v: any;
	}
}
