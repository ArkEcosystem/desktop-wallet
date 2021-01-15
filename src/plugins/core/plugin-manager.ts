import { container } from "./plugin-container";
import { PluginControllerRepository } from "./plugin-controller-repository";
import { PluginServiceRepository } from "./plugin-service-repository";

export class PluginManager {
	#plugins: PluginControllerRepository;

	constructor() {
		container.set("services", new PluginServiceRepository());

		this.#plugins = new PluginControllerRepository();
	}

	services() {
		return container.services();
	}

	plugins() {
		return this.#plugins;
	}
}
