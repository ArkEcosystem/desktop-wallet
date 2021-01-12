import { PluginController } from "plugins/core";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class LaunchPluginService implements PluginService {
	config() {
		return {
			id: PluginServiceIdentifier.Launch,
			accessor: "launch",
		};
	}

	api(plugin: PluginController) {
		return {
			render: (node: React.ReactNode) => plugin.hooks().registerCommand("service:launch.render", () => node),
		};
	}
}
