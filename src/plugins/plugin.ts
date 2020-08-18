import { Plugin, PluginManifest, PluginPermission, PluginSetting } from "./plugin.models";

export class PluginData {
	private _manifest: PluginManifest;
	private _entry: Plugin;

	constructor(manifest: PluginManifest, entry: Plugin) {
		this._manifest = manifest;
		this._entry = entry;
	}

	static make(manifest: PluginManifest, entry: Plugin) {
		// TODO: Sanitize
		return new PluginData(manifest, entry);
	}

	name() {
		return this._manifest.name;
	}

	descrption() {
		return this._manifest.description;
	}

	hasPermission(permission: PluginPermission) {
		return this._manifest.permissions?.includes(permission) || false;
	}

	config(key: PluginSetting) {
		return this._manifest.config[key];
	}

	manifest() {
		return this._manifest;
	}

	entry() {
		return this._entry;
	}
}
