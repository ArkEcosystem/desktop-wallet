import { PluginRegistry } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";

import { container } from "./plugin-container";
import { PluginControllerRepository } from "./plugin-controller-repository";
import { PluginServiceRepository } from "./plugin-service-repository";

export class PluginManager {
	#plugins: PluginControllerRepository;

	constructor() {
		container.set("registry", new PluginRegistry(httpClient));
		container.set("services", new PluginServiceRepository());

		this.#plugins = new PluginControllerRepository();
	}

	registry() {
		return container.registry();
	}

	services() {
		return container.services();
	}

	plugins() {
		return this.#plugins;
	}
}
