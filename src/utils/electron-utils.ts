import electron, { FileFilter, ipcRenderer } from "electron";
import { readFileSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import { Theme } from "types";

type DialogOptions = {
	filters?: FileFilter | FileFilter[];
	restrictToPath?: string;
	encoding?: "utf-8" | "base64";
	returnBasename?: boolean;
};

const defaultFilters = [
	{ name: "JSON", extensions: ["json"] },
	{ name: "All Files", extensions: ["*"] },
];

const defaultEncode = "utf8";

const setScreenshotProtection = (enabled: boolean) => {
	// Ignore the setting in dev mode
	if (isDev()) {
		electron.remote.getCurrentWindow().setContentProtection(false);
		return;
	}

	electron.remote.getCurrentWindow().setContentProtection(enabled);
};

const setThemeSource = (themeSource: Theme) => {
	electron.remote.nativeTheme.themeSource = themeSource;
};

const shouldUseDarkColors = () => electron.remote.nativeTheme.shouldUseDarkColors;

const isDev = () => {
	// Based on https://github.com/sindresorhus/electron-is-dev/blob/master/index.js
	const app = electron.app || electron.remote.app;
	const isEnvSet = "ELECTRON_IS_DEV" in process.env;

	return isEnvSet ? parseInt(process.env.ELECTRON_IS_DEV!, 10) === 1 : !app.isPackaged;
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

	writeFileSync(filePath, raw, encode);

	return options?.returnBasename ? path.basename(filePath) : filePath;
};

const openFile = async (defaultPath?: string | null, options?: DialogOptions) => {
	const filters = options?.filters ? parseFilters(options.filters) : defaultFilters;
	const encode = options?.encoding || defaultEncode;

	const { filePaths } = await electron.remote.dialog.showOpenDialog({
		defaultPath: defaultPath || os.homedir(),
		properties: ["openFile"],
		filters,
	});

	if (!filePaths || !filePaths.length) {
		return;
	}

	if (options?.restrictToPath && !validatePath(options.restrictToPath, filePaths[0])) {
		throw new Error(`Reading from "${filePaths[0]}" is not allowed`);
	}

	return readFileSync(filePaths[0], encode);
};

const openExternal = (value: string) => {
	if (!/^https?:\/\//.test(value)) {
		throw new Error();
	}

	const url = new URL(value);
	ipcRenderer.send("open-external", url.toString());
};

const isIdle = (idleTreshold: number) => electron.remote.powerMonitor.getSystemIdleTime() >= idleTreshold;

export {
	isDev,
	isIdle,
	openExternal,
	openFile,
	saveFile,
	setScreenshotProtection,
	setThemeSource,
	shouldUseDarkColors,
};
