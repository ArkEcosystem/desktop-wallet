const { ipcMain, ipcRenderer } = require("electron");

/**
 * The rendering process will trigger the event for loading the modules,
 * and execute the entry code through the vm to use the entry instance
 */
export const invokeLoader = async () => {
	const { PluginVM } = require("./vm");
	const result = await ipcRenderer.invoke("plugin:load");

	const vm = new PluginVM();

	return result.reduce((acc, { manifest, entryCode, entryPath }) => {
		try {
			const entry = vm.run(entryCode, entryPath);
			return [...acc, { manifest, entry }];
		} catch {
			return acc;
		}
	}, []);
};

/**
 * The main process will listen for a call to load the plugins in the specified folders
 */
export const injectLoaderHandle = () => {
	const { PluginLoader } = require("./loader");
	const isDev = require("electron-is-dev");
	const path = require("path");
	const os = require("os");

	const paths = [];

	if (isDev) {
		paths.push(path.resolve(".plugins"));
	}

	paths.push(path.resolve(os.homedir(), ".ark-desktop-v3", "plugins"));

	const loader = new PluginLoader(paths);

	ipcMain.handle("plugin:load", () => loader.load());
};

module.exports = {
	injectLoaderHandle,
	invokeLoader,
};
