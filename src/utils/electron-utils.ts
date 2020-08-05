import electron, { FileFilter } from "electron";
import { readFileSync, writeFileSync } from "fs";
import os from "os";
import path from "path";

type DialogOptions = {
	filters?: FileFilter | FileFilter[];
	restrictToPath?: string;
	encoding?: "utf-8" | "base64";
};

const defaultFilters = [
	{ name: "JSON", extensions: ["json"] },
	{ name: "All Files", extensions: ["*"] },
];

const defaultEncode = "utf8";

const setScreenshotProtection = (enabled: boolean) => {
	if (!electron.remote) {
		return;
	}

	electron.remote.getCurrentWindow().setContentProtection(enabled);
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

	if (!filePath) return;

	if (options?.restrictToPath && !validatePath(options.restrictToPath, filePath)) {
		throw new Error(`Writing to "${filePath}" is not allowed`);
	}

	writeFileSync(filePath, raw, encode);

	return filePath;
};

const openFile = async (defaultPath?: string | null, options?: DialogOptions) => {
	const filters = options?.filters ? parseFilters(options.filters) : defaultFilters;
	const encode = options?.encoding || defaultEncode;

	const { filePaths } = await electron.remote.dialog.showOpenDialog({
		defaultPath: defaultPath || os.homedir(),
		properties: ["openFile"],
		filters,
	});

	if (!filePaths || !filePaths.length) return;

	if (options?.restrictToPath && !validatePath(options.restrictToPath, filePaths[0])) {
		throw new Error(`Reading from "${filePaths[0]}" is not allowed`);
	}

	return readFileSync(filePaths[0], encode);
};

const isIdle = (idleTreshold: number) => electron.remote.powerMonitor.getSystemIdleState(idleTreshold) === "idle";

export { isIdle, openFile, saveFile, setScreenshotProtection };
