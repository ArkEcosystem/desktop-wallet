import { PluginController } from "plugins/core";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class EventsPluginService implements PluginService {
	config() {
		return {
			accessor: "events",
			id: PluginServiceIdentifier.Events,
		};
	}

	api(plugin: PluginController) {
		return {
			on: plugin.hooks().on.bind(plugin.hooks()),
		};
	}
}
