export interface ProfilePluginAPI {
	onDidProfileChange: (cb: (profile: object) => void) => void;
}

export interface HTTPPluginAPI {
	get: (url: string) => any;
}

export interface PluginAPI {
	profile: () => ProfilePluginAPI;
	http: () => HTTPPluginAPI;
}
