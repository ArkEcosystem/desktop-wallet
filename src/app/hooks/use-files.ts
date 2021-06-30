import electron from "electron";
import fs from "fs";
import os from "os";
import path from "path";

interface ReadableFile {
	content: Buffer;
	extension: string;
	name: string;
}

interface OpenFileParameters {
	extensions: string[];
}

interface UseFilesOutput {
	readFileContents: (filePath: string) => ReadableFile;
	openFile: (parameters: OpenFileParameters) => Promise<ReadableFile | undefined>;
}

const useFiles = (): UseFilesOutput => {
	const readFileContents = (filePath: string): ReadableFile => {
		const extension = path.extname(filePath);
		const content = fs.readFileSync(filePath);
		const name = path.basename(filePath);

		return { content, extension, name };
	};

	const openFile = async ({ extensions }: OpenFileParameters): Promise<ReadableFile | undefined> => {
		const { filePaths } = await electron.remote.dialog.showOpenDialog({
			defaultPath: os.homedir(),
			filters: [{ extensions, name: "" }],
			properties: ["openFile"],
		});

		if (!filePaths?.length) {
			return undefined;
		}

		return readFileContents(filePaths[0]);
	};

	return { openFile, readFileContents };
};

export { useFiles };

export type { ReadableFile };
