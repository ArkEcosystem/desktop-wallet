import { httpClient } from "../app/services";
import { HttpClient } from "../app/services/HttpClient";
import { HTTPPluginAPI, PluginAPI, ProfilePluginAPI } from "./api.models";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { PluginData } from "./plugin";
import { PluginPermission } from "./plugin.models";
import { ProfilePluginService } from "./services/profile.service";

class ProfileAPI implements ProfilePluginAPI {
	service: ProfilePluginService;
	plugin: PluginData;

	constructor(plugin: PluginData) {
		this.service = container.get(Identifiers.ProfileService);
		this.plugin = plugin;
	}

	onDidProfileChange(callback: (profile: any) => void) {
		this.service.onDidProfileChange(callback);
	}
}

class HttpAPI implements HTTPPluginAPI {
	service: HttpClient;
	plugin: PluginData;

	constructor(plugin: PluginData) {
		this.service = httpClient;
		this.plugin = plugin;
	}

	get(url: string) {
		if (this.plugin.hasPermission(PluginPermission.Http)) {
			return this.service.get(url);
		}
	}
}

export class API implements PluginAPI {
	plugin: PluginData;

	constructor(plugin: PluginData) {
		this.plugin = plugin;
	}

	profile() {
		return new ProfileAPI(this.plugin);
	}

	http() {
		return new HttpAPI(this.plugin);
	}
}
