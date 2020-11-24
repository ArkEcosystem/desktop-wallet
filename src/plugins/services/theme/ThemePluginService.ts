import { PluginController } from "plugins/core";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class ThemePluginService implements PluginService {
	config() {
		return {
			id: PluginServiceIdentifier.Theme,
			accessor: "theme",
		};
	}

	api(plugin: PluginController) {
		return {
			decorate: plugin.hooks().addFilter.bind(plugin.hooks(), "service.theme"),
		};
	}
}
