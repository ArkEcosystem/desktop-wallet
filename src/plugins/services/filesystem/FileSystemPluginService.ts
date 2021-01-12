import electron from "electron";
import fs from "fs";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class FileSystemPluginService implements PluginService {
	config() {
		return {
			id: PluginServiceIdentifier.FileSystem,
			accessor: "filesystem",
		};
	}

	api() {
		return {
			askUserToSaveFile: this.askUserToSaveFile.bind(undefined),
			askUserToOpenFile: this.askUserToOpenFile.bind(undefined),
		};
	}

	private async askUserToSaveFile(content: string, suggestedFileName?: string) {
		const { filePath } = await electron.remote.dialog.showSaveDialog({});

		/* istanbul ignore next */
		if (!filePath) {
			return;
		}

		return fs.writeFileSync(filePath, content, "utf-8");
	}

	private async askUserToOpenFile() {
		const { filePaths } = await electron.remote.dialog.showOpenDialog({ properties: ["openFile"] });

		/* istanbul ignore next */
		if (!filePaths?.length) {
			return;
		}

		return fs.readFileSync(filePaths[0], "utf-8");
	}
}
