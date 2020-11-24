import { ipcMain, ipcRenderer } from "electron";
import os from "os";
import path from "path";

import { PluginRawInstance } from "../../types";
import { PluginLoaderFileSystem } from "./loader-fs";

export const search = (): Promise<PluginRawInstance[]> => ipcRenderer.invoke("plugin:loader-fs.search");
export const remove = (dir: string): Promise<PluginRawInstance[]> => ipcRenderer.invoke("plugin:loader-fs.remove", dir);

export const injectHandler = () => {
	const isDev = require("electron-is-dev");
	const paths: string[] = [];

	const envDir = process.env.PLUGINS_DIR;

	if (envDir) {
		paths.push(envDir);
	}

	if (isDev) {
		paths.push(path.resolve("src/tests/fixtures/plugins"));
	}

	paths.push(path.resolve(os.homedir(), ".ark-desktop-v3", "plugins"));

	const finder = new PluginLoaderFileSystem(paths);

	ipcMain.handle("plugin:loader-fs.search", () => finder.search());
	ipcMain.handle("plugin:loader-fs.remove", (_, dir: string) => finder.remove(dir));
};
