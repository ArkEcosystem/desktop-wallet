import electron from "electron";

import { injectHandler } from "./loader-fs-handler";

describe("Plugin Loader Handler", () => {
	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should handle", () => {
		const spyIpc = jest.spyOn(electron.ipcMain, "handle").mockImplementation();
		injectHandler();
		expect(spyIpc).toHaveBeenCalledTimes(3);
	});
});
