import { PluginController } from "plugins/core";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class LaunchPluginService implements PluginService {
	config() {
		return {
			accessor: "launch",
			id: PluginServiceIdentifier.Launch,
		};
	}

	api(plugin: PluginController) {
		return {
			render: (node: React.ReactNode) => plugin.hooks().registerCommand("service:launch.render", () => node),
		};
	}
}
