import { httpClient } from "app/services";
import { HttpClient } from "app/services/HttpClient";
import { PluginController } from "plugins/core";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class HttpPluginService implements PluginService {
	config() {
		return {
			id: PluginServiceIdentifier.HTTP,
			accessor: "http",
		};
	}

	api(plugin: PluginController) {
		return {
			create: () => new HttpClient(500),
			decorate: plugin.hooks().addFilter.bind(plugin.hooks(), "service.http"),
			get: this.send.bind(undefined, "get", plugin),
			post: this.send.bind(undefined, "post", plugin),
		};
	}

	private send(type: "get" | "post", plugin: PluginController, url: string, ...args: any) {
		const isValid = plugin
			.config()
			.urls()
			?.some((uri) => new RegExp(uri).test(url));

		if (!isValid) {
			throw new Error(`URL "${url}" not found in the plugin "${plugin.config().name()}" manifest.`);
		}

		return httpClient[type](url, ...args);
	}
}
