const { ipcMain, ipcRenderer } = require("electron");

const load = () => ipcRenderer.invoke("plugin:load");

const handleLoad = () => {
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
	handleLoad,
	load,
};
