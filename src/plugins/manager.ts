/* eslint-disable @typescript-eslint/require-await */
import { container } from "./container";
import { Identifiers } from "./container.models";
import { PluginController } from "./controller";
import * as pluginRpc from "./loader/rpc";
import { PluginData } from "./plugin";
import { PluginLoader } from "./plugin.models";
import { ProfilePluginService } from "./services/profile.service";
import { RoutePluginService } from "./services/route.service";

export class PluginManager {
	private _controller: PluginController;

	constructor() {
		this._controller = new PluginController();
		this.registerBindings();
	}

	async boot() {
		const localPlugins = await this.loadFromFileSystem();
		const plugins: PluginData[] = [];

		for (const loader of localPlugins) {
			const pluginData = PluginData.make(loader.manifest, loader.entry);
			plugins.push(pluginData);
		}

		this._controller.fill(plugins);
	}

	plugins() {
		return this._controller;
	}

	services() {
		return {
			profile: container.get<ProfilePluginService>(Identifiers.ProfileService),
			route: container.get<RoutePluginService>(Identifiers.RouteService),
		};
	}

	private async loadFromFileSystem(): Promise<PluginLoader[]> {
		const result = await pluginRpc.load();
		return result;
	}

	private registerBindings() {
		container.set(Identifiers.ProfileService, new ProfilePluginService());
		container.set(Identifiers.RouteService, new RoutePluginService());
	}
}
