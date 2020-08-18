/* eslint-disable @typescript-eslint/require-await */
import React from "react";

import { container } from "./container";
import { Identifiers } from "./container.models";
import { PluginController } from "./controller";
import { PluginData } from "./plugin";
import { Plugin, PluginManifest } from "./plugin.models";
import { ProfilePluginService } from "./services/profile.service";
import { RoutePluginService } from "./services/route.service";

interface PluginLoader {
	manifest: PluginManifest;
	entry: Plugin;
}

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
		// TODO
		return [
			{
				manifest: {
					name: "example",
					description: "Test",
					permissions: [],
					config: {},
				},
				entry: {
					registerRoutes: () => [
						{
							path: "/test",
							// eslint-disable-next-line react/display-name
							component: () => React.createElement("h1", null, "test"),
						},
					],
				},
			},
		];
	}

	private registerBindings() {
		container.set(Identifiers.ProfileService, new ProfilePluginService());
		container.set(Identifiers.RouteService, new RoutePluginService());
	}
}
