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

	private askUserToSaveFile(content: string, suggestedFileName?: string) {
		const filePath = electron.remote.dialog.showSaveDialogSync({});

		if (!filePath) {
			return;
		}

		return fs.writeFileSync(filePath, content, "utf-8");
	}

	private askUserToOpenFile() {
		const filePaths = electron.remote.dialog.showOpenDialogSync({ properties: ["openFile"] });

		if (!filePaths?.length) {
			return;
		}

		return fs.readFileSync(filePaths[0], "utf-8");
	}
}
