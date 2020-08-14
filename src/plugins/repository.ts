/* eslint-disable @typescript-eslint/require-await */
import { API } from "./api";
import { PluginData } from "./plugin";
import { IPluginData, Plugin, PluginManifest } from "./plugin.models";

interface PluginLoader {
	manifest: PluginManifest;
	entry: Plugin;
}

export class PluginRepository {
	_plugins: IPluginData[] = [];

	async boot() {
		const localPlugins = await this.loadFromFileSystem();

		for (const loader of localPlugins) {
			const pluginData = PluginData.fromManifest(loader.manifest);
			const pluginAPI = new API(pluginData);
			loader.entry.activate?.(pluginAPI);

			this._plugins.push(pluginData);
		}
	}

	private async loadFromFileSystem(): Promise<PluginLoader[]> {
		throw new Error("Not implemented");
	}
}
