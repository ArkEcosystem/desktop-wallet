import { httpClient } from "../app/services";
import { HttpClient } from "../app/services/HttpClient";
import { HTTPPluginAPI, PluginAPI, ProfilePluginAPI } from "./api.models";
import { IPluginData, PluginPermission } from "./plugin.models";
import { ProfilePluginService, profilePluginService } from "./services/profile.service";

class ProfileAPI implements ProfilePluginAPI {
	service: ProfilePluginService;
	plugin: IPluginData;

	constructor(plugin: IPluginData) {
		this.service = profilePluginService;
		this.plugin = plugin;
	}

	onDidProfileChange(callback: (profile: any) => void) {
		profilePluginService.onDidProfileChange(callback);
	}
}

class HttpAPI implements HTTPPluginAPI {
	service: HttpClient;
	plugin: IPluginData;

	constructor(plugin: IPluginData) {
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
	plugin: IPluginData;

	constructor(plugin: IPluginData) {
		this.plugin = plugin;
	}

	profile() {
		return new ProfileAPI(this.plugin);
	}

	http() {
		return new HttpAPI(this.plugin);
	}
}
