import { Profile, RegistryPlugin } from "@arkecosystem/platform-sdk-profiles";

import { PluginAPI } from "../types";
import { PluginConfigurationData } from "./configuration";
import { applyPluginMiddlewares, isPluginEnabled, PluginHooks } from "./internals";
import { container } from "./plugin-container";

type Callback = (api: PluginAPI) => void;

export class PluginController {
	#hooks: PluginHooks;

	#config: PluginConfigurationData;
	#callback: Callback;
	#dir: string | undefined;

	#data: RegistryPlugin | undefined;

	constructor(config: Record<string, any>, callback: Callback, dir?: string) {
		this.#hooks = new PluginHooks();
		this.#dir = dir;
		this.#config = PluginConfigurationData.make(config, dir);
		this.#callback = callback;
	}

	data() {
		return this.#data;
	}

	async sync() {
		const { data } = await container.registry().findById(this.config().id());
		this.#data = data;
	}

	hooks() {
		return this.#hooks;
	}

	dir() {
		return this.#dir;
	}

	config() {
		return this.#config;
	}

	isEnabled(profile: Profile) {
		return profile
			.plugins()
			.values()
			.find((item) => item.id === this.config().id());
	}

	// TODO: Better integration with SDK
	enable(profile: Profile, options?: { autoRun?: true }) {
		// @ts-ignore
		profile.plugins().push({ id: this.config().id(), isEnabled: true });

		if (options?.autoRun) {
			this.run(profile);
		}
	}

	disable(profile: Profile) {
		profile.plugins().forget(this.config().id());
		this.dispose();
	}

	run(profile: Profile) {
		const pluginAPI = container.services().api(this, profile);
		const guard = applyPluginMiddlewares({ profile, plugin: this }, [isPluginEnabled]);

		try {
			// @ts-ignore
			const fn = this.#callback?.default || this.#callback;
			guard(fn?.(pluginAPI));
			this.#hooks.emit("activated");
		} catch (e) {
			console.error(`Failed to run the plugin "${this.config().name()}": ${e.message}`);
		}
	}

	dispose() {
		this.#hooks.clearAll();
		this.#hooks.emit("deactivated");
	}
}
