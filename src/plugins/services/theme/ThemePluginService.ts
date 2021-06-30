import { PluginController } from "plugins/core";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class ThemePluginService implements PluginService {
	config() {
		return {
			accessor: "theme",
			id: PluginServiceIdentifier.Theme,
		};
	}

	api(plugin: PluginController) {
		return {
			decorate: plugin.hooks().addFilter.bind(plugin.hooks(), "service.theme"),
		};
	}
}
