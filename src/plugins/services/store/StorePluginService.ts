import { Contracts, Repositories } from "@arkecosystem/platform-sdk-profiles";
import { PluginController } from "plugins/core";
import { PluginHooks } from "plugins/core/internals/plugin-hooks";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class StorePluginService implements PluginService {
	#profile: Contracts.IProfile | undefined;
	#stores: Map<string, Contracts.IDataRepository> = new Map();

	config() {
		return {
			id: PluginServiceIdentifier.Store,
			accessor: "store",
		};
	}

	boot(context: { hooks: PluginHooks }) {
		context.hooks.on("profile", (profile) => (this.#profile = profile));
	}

	api(plugin: PluginController) {
		const id = plugin.config().id();
		if (!this.#stores.has(id)) {
			this.create(id);
		}

		const store = this.#stores.get(id);

		return {
			data: () => store,
			// @ts-ignore
			persist: this.persist.bind(this, id, store),
		};
	}

	private create(pluginId: string) {
		const data = new Repositories.DataRepository();
		const stored = this.restore(pluginId);

		if (stored && Object.keys(stored).length > 0) {
			data.fill(stored);
		}

		this.#stores.set(pluginId, data);
	}

	private restore(pluginId: string) {
		return this.#profile?.data().get(`plugins.${pluginId}.store`, {});
	}

	private persist(pluginId: string, data: Contracts.IDataRepository) {
		return this.#profile?.data().set(`plugins.${pluginId}.store`, data.all());
	}
}
