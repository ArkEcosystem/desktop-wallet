import electron from "electron";
import fs from "fs";
import path from "path";

export type ReadableFile = {
	content: string;
	extension: string;
	name: string;
};

export const useFiles = () => {
	const readFileContents = (filePath: string): ReadableFile => {
		const extension = path.extname(filePath);
		const content = fs.readFileSync(filePath);
		const name = path.basename(filePath);

		return { name, content: content.toString(), extension };
	};

	const openFile = async ({ extensions }: { extensions: string[] }) => {
		const { filePaths } = await electron.remote.dialog.showOpenDialog({
			properties: ["openFile"],
			filters: [{ name: "", extensions }],
		});

		if (!filePaths?.length) {
			return;
		}

		return readFileContents(filePaths[0]);
	};

	return { openFile, readFileContents };
};
