import { PluginRegistry } from "@arkecosystem/platform-sdk-profiles";

import { PluginServiceRepository } from "./plugin-service-repository";

export class PluginContainer {
	#data = new Map();

	set<T>(key: "services" | "registry", service: T) {
		this.#data.set(key, service);
	}

	services(): PluginServiceRepository {
		return this.#data.get("services");
	}

	registry(): PluginRegistry {
		return this.#data.get("registry");
	}
}

export const container = new PluginContainer();
