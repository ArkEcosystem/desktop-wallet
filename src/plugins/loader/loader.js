const path = require("path");
const glob = require("glob");
const fs = require("fs");

/**
 * This file should be used by the main process (electron)
 * since the renderer can not require modules from an external source.
 *
 * Search for package.json files recursively in subfolders,
 * then parse as a JSON object to read the `main` field and require the entry file.
 *
 * @params localPaths string[]
 */
class PluginLoader {
	_localPaths = [];

	constructor(localPaths) {
		this._localPaths = localPaths;
	}

	load() {
		const manifestsPath = this.findManifestsPath();
		const manifestsAssets = this.loadManifestsFromPaths(manifestsPath);

		return this.requirePluginFromManifests(manifestsAssets);
	}

	requirePluginFromManifests(manifestsAssets) {
		const loads = [];
		for (const { manifest, dir } of manifestsAssets) {
			try {
				const main = manifest.main || "index.js";
				const entry = require(path.resolve(dir, main));

				loads.push({
					manifest,
					entry,
				});
			} catch (e) {
				throw new Error("[PluginLoader] Failed to require entry file");
			}
		}
		return loads;
	}

	loadManifestsFromPaths(filesPath) {
		const manifests = [];

		for (const file of filesPath) {
			try {
				const manifest = JSON.parse(fs.readFileSync(file));
				manifests.push(manifest);
			} catch {
				manifests.push(null);
				console.warn("[PluginLoader] Failed to parse manifest file");
			}
		}

		return filesPath.reduce((acc, filePath, index) => {
			const dir = path.dirname(filePath);
			const manifest = manifests[index];

			if (!manifest) {
				return acc;
			}

			return [...acc, { dir, manifest }];
		}, []);
	}

	findManifestsPath() {
		return this._localPaths.reduce((acc, localPath) => {
			const match = glob.sync("**/package.json", {
				nodir: true,
				absolute: true,
				cwd: localPath,
			});

			return [...acc, ...match];
		}, []);
	}
}

module.exports.PluginLoader = PluginLoader;
