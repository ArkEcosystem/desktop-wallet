import { ipcMain } from "electron";
import os from "os";
import path from "path";

import { PluginLoaderFileSystem } from "./loader-fs";

export const injectHandler = () => {
	const isDev = require("electron-is-dev");
	const isE2E = process.env.ELECTRON_IS_E2E;
	const paths: string[] = [];

	const envDir = process.env.PLUGINS_DIR;

	/* istanbul ignore next */
	if (envDir) {
		paths.push(envDir);
	}

	/* istanbul ignore next */
	if (isDev || isE2E) {
		paths.push(path.resolve("src/tests/fixtures/plugins"));
	}

	paths.push(path.resolve(os.homedir(), ".ark-desktop-v3", "plugins"));

	const finder = new PluginLoaderFileSystem(paths);

	/* istanbul ignore next */
	ipcMain.handle("plugin:loader-fs.search", () => finder.search());
	/* istanbul ignore next */
	ipcMain.handle("plugin:loader-fs.remove", (_, dir: string) => finder.remove(dir));
};
