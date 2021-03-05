import { Profile } from "@arkecosystem/platform-sdk-profiles";

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

	constructor(config: Record<string, any>, callback: Callback, dir?: string) {
		this.#hooks = new PluginHooks();
		this.#dir = dir;
		this.#config = PluginConfigurationData.make(config, dir);
		this.#callback = callback;
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
		return !!this.pluginData(profile);
	}

	// TODO: Better integration with SDK
	enable(profile: Profile, options?: { autoRun?: true }) {
		// @ts-ignore
		const { id } = profile.plugins().push({ name: this.config().name(), isEnabled: true });

		/* istanbul ignore next */
		if (options?.autoRun) {
			this.run(profile);
		}

		return id;
	}

	disable(profile: Profile) {
		if (this.isEnabled(profile)) {
			profile.plugins().forget(this.pluginData(profile)!.id);
			this.dispose();
		}
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

	private pluginData(profile: Profile) {
		return profile
			.plugins()
			.values()
			.find((item) => item.name === this.config().name());
	}
}
