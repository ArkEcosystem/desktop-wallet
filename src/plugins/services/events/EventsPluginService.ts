import { PluginController } from "plugins/core";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class EventsPluginService implements PluginService {
	config() {
		return {
			id: PluginServiceIdentifier.Events,
			accessor: "events",
		};
	}

	api(plugin: PluginController) {
		return {
			on: plugin.hooks().on.bind(plugin.hooks()),
		};
	}
}
