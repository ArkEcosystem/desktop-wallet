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

		let savePath: string;

		await download(win, url, {
			directory: downloadPath,
			onStarted: (item) => (savePath = item.getSavePath()),
			onProgress: (progress) => win.webContents.send("plugin:download-progress", progress),
		});

		const pluginPath = path.join(installPath, name);

		await decompress(savePath!, pluginPath, {
			map: (file: any) => {
				file.path = file.path.split("/").slice(1).join("/");
				return file;
			},
		});

		await trash(savePath!);

		return pluginPath;
	});

	injectHandler();
};
