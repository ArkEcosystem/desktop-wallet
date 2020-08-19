/* eslint-disable @typescript-eslint/require-await */
import { API } from "./api";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { PluginData } from "./plugin";
import { RoutePluginService } from "./services/route.service";

export class PluginController {
	private _plugins: PluginData[] = [];

	fill(plugins: PluginData[]) {
		this._plugins = plugins;

		this.register();
	}

	get(name: string) {
		return this._plugins.find((item) => item.name() === name);
	}

	render(name: string) {
		const plugin = this.get(name);

		if (!plugin) {
			return;
		}

		const pluginAPI = new API(plugin);
		return plugin.entry().render?.({ pluginAPI });
	}

	register() {
		this.registerRoutes();
	}

	activate() {
		// TODO: Check profile authorization
		for (const plugin of this._plugins) {
			const api = new API(plugin);
			plugin.entry().activate?.(api);
		}
	}

	deactivate() {
		const routeService = container.get<RoutePluginService>(Identifiers.RouteService);
		for (const plugin of this._plugins) {
			routeService.remove(plugin.name());
			plugin.entry().deactivate?.();
		}
	}

	private registerRoutes() {
		const routeService = container.get<RoutePluginService>(Identifiers.RouteService);
		for (const plugin of this._plugins) {
			const routes = plugin.entry().registerRoutes?.();
			if (routes) {
				routeService.add(plugin.name(), routes);
			}
		}
	}
}
