import { Profile } from "@arkecosystem/platform-sdk-profiles";

import { PluginAPI, PluginService, PluginServiceIdentifier } from "../types";
import { PluginHooks } from "./internals/plugin-hooks";
import { applyPluginMiddlewares, isServiceDefinedInConfig, isServiceEnabled } from "./internals/plugin-permission";
import { PluginController } from "./plugin-controller";
import { PluginServiceData } from "./plugin-service";

export class PluginServiceRepository {
	#services: Map<string, PluginServiceData> = new Map();
	#hooks: PluginHooks;

	constructor() {
		this.#hooks = new PluginHooks();
	}

	all() {
		return this.#services;
	}

	hooks() {
		return this.#hooks;
	}

	api(plugin: PluginController, profile: Profile) {
		const result = {};

		for (const service of this.#services.values()) {
			const guard = applyPluginMiddlewares({ profile, plugin, service }, [
				isServiceEnabled,
				isServiceDefinedInConfig,
			]);
			const accessor = service.accessor();
			// @ts-ignore
			result[accessor] = guard(() => service.api(plugin));
		}

		return result as PluginAPI;
	}

	boot() {
		for (const service of this.#services.values()) {
			service.instance().boot?.({
				hooks: this.hooks(),
			});
		}
	}

	register(services: PluginService[]) {
		for (const service of services) {
			const data = new PluginServiceData(service);
			this.#services.set(data.id(), data);
		}
	}

	findById(id: PluginServiceIdentifier) {
		return this.#services.get(id);
	}
}
