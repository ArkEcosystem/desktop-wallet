import { IPluginData, PluginManifest, PluginPermission, PluginSetting } from "./plugin.models";

export class PluginData implements IPluginData {
	_manifest: PluginManifest;

	constructor(manifest: PluginManifest) {
		this._manifest = manifest;
	}

	static fromManifest(manifest: PluginManifest) {
		// TODO: Sanitize
		return new PluginData(manifest);
	}

	authorize() {
		throw new Error("Not implemented");
	}

	isAuthorized(): boolean {
		throw new Error("Not implemented");
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
}
