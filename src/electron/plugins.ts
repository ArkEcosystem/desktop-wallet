import decompress from "decompress";
import { BrowserWindow, ipcMain } from "electron";
import { download } from "electron-dl";
import { ensureDirSync } from "fs-extra";
import os from "os";
import path from "path";
import trash from "trash";

import { injectHandler } from "../plugins/loader/fs/loader-fs-handler";

export const setupPlugins = () => {
	const installPath = path.resolve(os.homedir(), ".ark-desktop-v3", "plugins");
	const downloadPath = path.join(installPath, ".cache");

	ensureDirSync(downloadPath);

	ipcMain.handle("plugin:download", async (_, { url, name }) => {
		const win = BrowserWindow.getFocusedWindow();

		if (!win) {
			return;
		}

		let savedPath: string;

		await download(win, url, {
			directory: downloadPath,
			onStarted: (item) => (savedPath = item.getSavePath()),
			onProgress: (progress) => win.webContents.send("plugin:download-progress", { ...progress, name }),
		});

		return savedPath!;
	});

	ipcMain.handle("plugin:install", async (_, { savedPath, name }) => {
		const pluginPath = path.join(installPath, name);

		await decompress(savedPath, pluginPath, {
			map: (file: any) => {
				file.path = file.path.split("/").slice(1).join("/");
				return file;
			},
		});

		await trash(savedPath);

		return pluginPath;
	});

	injectHandler();
};
