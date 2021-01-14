import { Profile } from "@arkecosystem/platform-sdk-profiles";
import electron from "electron";
import fs from "fs";
import { PluginController, PluginManager } from "plugins/core";
import { PluginAPI } from "plugins/types";
import { env } from "utils/testing-library";

import { FileSystemPluginService } from "./FileSystemPluginService";

const config = {
	name: "test",
	version: "1.1",
	"desktop-wallet": { permissions: ["FILESYSTEM"] },
};

describe.skip("FileSystemPluginService", () => {
	let profile: Profile;
	let manager: PluginManager;
	let ctrl: PluginController;

	beforeEach(() => {
		profile = env.profiles().first();

		manager = new PluginManager();
		manager.services().register([new FileSystemPluginService()]);
		manager.services().boot();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should open file", async () => {
		let content: any;

		jest.spyOn(electron.remote.dialog, "showOpenDialog").mockResolvedValue({ filePaths: ["/test.txt"] });
		jest.spyOn(fs, "readFileSync").mockReturnValue("test");

		const fixture = (api: PluginAPI) => {
			api.filesystem()
				.askUserToOpenFile()
				.then((value) => (content = value));
		};

		ctrl = new PluginController(config, fixture);
		ctrl.enable(profile);

		manager.plugins().push(ctrl);
		manager.plugins().runAllEnabled(profile);

		await new Promise((r) => setTimeout(r, 200));

		expect(content).toBe("test");
	});

	it("should save file", async () => {
		const content = "test";

		jest.spyOn(electron.remote.dialog, "showSaveDialog").mockResolvedValue({ filePath: "/test.txt" });
		const writeSpy = jest.spyOn(fs, "writeFileSync").mockImplementation();

		const fixture = (api: PluginAPI) => {
			api.filesystem().askUserToSaveFile(content);
		};

		ctrl = new PluginController(config, fixture);
		ctrl.enable(profile);

		manager.plugins().push(ctrl);
		manager.plugins().runAllEnabled(profile);

		await new Promise((r) => setTimeout(r, 200));

		expect(writeSpy).toHaveBeenCalled();
	});
});
