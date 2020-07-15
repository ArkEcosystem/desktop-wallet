import electron, { FileFilter } from "electron";
import { readFileSync, writeFileSync } from "fs";
import os from "os";
import path from "path";

type DialogOptions = {
	filters?: FileFilter | FileFilter[];
	restrictToPath?: string;
};

const defaultFilters = [
	{ name: "JSON", extensions: ["json"] },
	{ name: "All Files", extensions: ["*"] },
];

const validatePath = (parentPath: string, filePath: string) => {
	const relative = path.relative(parentPath, filePath);
	return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
};

const parseFilters = (filters: FileFilter | FileFilter[]) => {
	return Array.isArray(filters) ? filters : [filters];
};

const saveFile = async (raw: any, defaultPath?: string, options?: DialogOptions) => {
	const filters = options?.filters ? parseFilters(options.filters) : defaultFilters;

	const { filePath } = await electron.remote.dialog.showSaveDialog({
		defaultPath,
		filters,
	});

	if (!filePath) return;

	if (options?.restrictToPath && !validatePath(options.restrictToPath, filePath)) {
		throw new Error(`Writing to "${filePath}" is not allowed`);
	}

	writeFileSync(filePath, raw, "utf8");

	return filePath;
};

const openFile = async (defaultPath?: string, options?: DialogOptions) => {
	const filters = options?.filters ? parseFilters(options.filters) : defaultFilters;

	const { filePaths } = await electron.remote.dialog.showOpenDialog({
		defaultPath: defaultPath || os.homedir(),
		properties: ["openFile"],
		filters,
	});

	if (!filePaths || !filePaths.length) return;

	if (options?.restrictToPath && !validatePath(options.restrictToPath, filePaths[0])) {
		throw new Error(`Reading from "${filePaths[0]}" is not allowed`);
	}

	return readFileSync(filePaths[0], "utf8");
};

export { openFile, saveFile };
