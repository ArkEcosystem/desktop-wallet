import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Checkbox } from "app/components/Checkbox";
import { Clipboard } from "app/components/Clipboard";
import { Input, InputCurrency } from "app/components/Input";
import { Spinner } from "app/components/Spinner";
import { TabPanel, Tabs } from "app/components/Tabs";
import { runUnknownCode } from "plugins/loader/vm";

import { Box } from "../components/shared/Box";
import { PluginRawInstance } from "../types";
import { container } from "./plugin-container";
import { PluginController } from "./plugin-controller";

export class PluginControllerRepository {
	#plugins: PluginController[] = [];
	#currentProfile: Profile | undefined;

	all() {
		return this.#plugins;
	}

	enabled(profile: Profile) {
		return profile
			.plugins()
			.values()
			.filter((item) => item.isEnabled)
			.map((item) => this.findById(item.name));
	}

	removeById(id: string, profile: Profile) {
		const plugin = this.findById(id);

		if (plugin) {
			plugin.disable(profile);
			this.#plugins = this.#plugins.filter((plugin) => plugin.config().id() !== id);
		}
	}

	findById(id: string) {
		return this.#plugins.find((item) => item.config().id() === id);
	}

	filterByCategory(category: string) {
		return this.#plugins.filter((item) => item.config().categories().includes(category));
	}

	currentProfile() {
		return this.#currentProfile;
	}

	runAllEnabled(profile: Profile) {
		if (this.#currentProfile) {
			throw new Error(
				`Profile ${this.#currentProfile.id()} has the plugins running, call #dispose to close them first.`,
			);
		}

		container.services().hooks().emit("profile", profile);

		for (const plugin of this.enabled(profile)) {
			plugin?.run(profile);
		}

		this.#currentProfile = profile;
	}

	dispose() {
		if (!this.#currentProfile) {
			throw new Error(`No plugins running, call #boot to run them.`);
		}

		container.services().hooks().emit("profile", undefined);

		const enabledPlugins = this.#currentProfile
			.plugins()
			.values()
			.filter((item) => item.isEnabled);

		for (const plugin of enabledPlugins) {
			const ctrl = this.findById(plugin.id);
			ctrl?.dispose();
		}

		this.#currentProfile = undefined;
	}

	push(instance: PluginController) {
		this.#plugins.push(instance);
	}

	fill(instances: PluginRawInstance[]) {
		const plugins: Record<string, PluginController> = {};

		for (const entry of instances) {
			try {
				const callback = runUnknownCode(entry.source, entry.sourcePath, {
					ark: { Components: { Box, Tabs, TabPanel, Spinner, Clipboard, Input, InputCurrency, Checkbox } },
				});
				const plugin = new PluginController(
					entry.config,
					// @ts-ignore
					callback,
					entry.dir,
				);

				plugin.config().validate();

				plugins[plugin.config().id()] = plugin;
			} catch (e) {
				console.error(`Failed to parse the plugin from "${entry.dir}".`, e.message);
			}
		}

		for (const [pluginId, plugin] of Object.entries(plugins)) {
			const currentIndex = this.#plugins.findIndex((item) => item.config().id() === pluginId);
			// Update existing plugin configuration
			if (currentIndex >= 0) {
				this.#plugins[currentIndex] = plugin;
				delete plugins[pluginId];
			}
		}

		this.#plugins.push(...Object.values(plugins));
	}

	// Helpers

	hasFilters(namespace: string, hookName: string) {
		return this.#plugins.some((plugin) => plugin.hooks().hasFilter(namespace, hookName));
	}

	applyFilters<T>(namespace: string, hookName: string, content: T, props?: Record<string, any>): T {
		const plugins = this.#plugins.filter((plugin) => plugin.hooks().hasFilter(namespace, hookName));

		if (!plugins.length) {
			return content;
		}

		return plugins.reduce((acc, plugin) => plugin.hooks().applyFilter(namespace, hookName, acc, props)!, content);
	}
}
