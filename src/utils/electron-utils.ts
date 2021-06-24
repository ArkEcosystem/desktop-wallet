import electron, { FileFilter, ipcRenderer } from "electron";
import fs from "fs";
import path from "path";
import { Theme } from "types";

interface DialogOptions {
	filters?: FileFilter | FileFilter[];
	restrictToPath?: string;
	encoding?: "utf-8" | "base64";
	returnBasename?: boolean;
}

const defaultFilters = [
	{ name: "JSON", extensions: ["json"] },
	{ name: "All Files", extensions: ["*"] },
];

const defaultEncode = "utf8";

const setScreenshotProtection = (enabled: boolean) => {
	// Ignore the setting in dev mode
	if (isDevelopment()) {
		electron.remote.getCurrentWindow().setContentProtection(false);
		return;
	}

	electron.remote.getCurrentWindow().setContentProtection(enabled);
};

const setThemeSource = (themeSource: Theme) => {
	electron.remote.nativeTheme.themeSource = themeSource;
};

const shouldUseDarkColors = () => electron.remote.nativeTheme.shouldUseDarkColors;

const isDevelopment = () => {
	// Based on https://github.com/sindresorhus/electron-is-dev/blob/master/index.js
	const app = electron.app || electron.remote.app;
	const isEnvironmentSet = "ELECTRON_IS_DEV" in process.env;

	return isEnvironmentSet ? Number.parseInt(process.env.ELECTRON_IS_DEV!, 10) === 1 : !app.isPackaged;
};

const validatePath = (parentPath: string, filePath: string) => {
	const relative = path.relative(parentPath, filePath);
	return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
};

const parseFilters = (filters: FileFilter | FileFilter[]) => (Array.isArray(filters) ? filters : [filters]);

const saveFile = async (raw: any, defaultPath?: string, options?: DialogOptions) => {
	const filters = options?.filters ? parseFilters(options.filters) : defaultFilters;
	const encode = options?.encoding || defaultEncode;

	const { filePath } = await electron.remote.dialog.showSaveDialog({
		defaultPath,
		filters,
	});

	if (!filePath) {
		return;
	}

	if (options?.restrictToPath && !validatePath(options.restrictToPath, filePath)) {
		throw new Error(`Writing to "${filePath}" is not allowed`);
	}

	fs.writeFileSync(filePath, raw, encode);

	return options?.returnBasename ? path.basename(filePath) : filePath;
};

const openExternal = (value: string) => {
	if (!/^https?:\/\//.test(value)) {
		throw new Error();
	}

	const url = new URL(value);
	ipcRenderer.send("open-external", url.toString());
};

const isIdle = (idleTreshold: number) => {
	console.log(electron.remote.powerMonitor.getSystemIdleTime());
	return electron.remote.powerMonitor.getSystemIdleTime() >= idleTreshold;
};

export {
	isDevelopment as isDev,
	isIdle,
	openExternal,
	saveFile,
	setScreenshotProtection,
	setThemeSource,
	shouldUseDarkColors,
};
