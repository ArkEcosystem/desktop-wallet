import { PluginService } from "../types";
import { PluginController } from "./plugin-controller";

export class PluginServiceData {
	#instance: PluginService;

	constructor(instance: PluginService) {
		this.#instance = instance;
	}

	instance<T extends PluginService>(): T {
		return this.#instance as T;
	}

	api(plugin: PluginController) {
		return this.#instance.api(plugin);
	}

	config() {
		return this.#instance.config();
	}

	id() {
		return this.config().id;
	}

	accessor() {
		return this.config().accessor;
	}
}
