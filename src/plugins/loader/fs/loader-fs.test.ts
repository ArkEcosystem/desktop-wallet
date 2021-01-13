import fs from "fs-extra";
import path from "path";

import { PluginLoaderFileSystem } from "./loader-fs";

describe("PluginLoaderFileSystem", () => {
	let subject: PluginLoaderFileSystem;
	let root: string;

	beforeEach(() => {
		root = path.resolve("src/tests/fixtures/plugins");
		subject = new PluginLoaderFileSystem([root]);
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should find manifests file in the folder", () => {
		expect(subject.search()).toHaveLength(2);
	});

	it("should remove a valid folder", () => {
		const removeMock = jest.spyOn(fs, "remove").mockImplementation();
		subject.remove(path.resolve("src/tests/fixtures/plugins/plugin-test-custom-buttom"));
		expect(removeMock).toHaveBeenCalled();
	});

	it("should not remove an invalid folder", async () => {
		const removeMock = jest.spyOn(fs, "remove").mockImplementation();
		await expect(subject.remove(path.resolve("/etc/plugins/plugin-test-custom-buttom"))).rejects.toMatch(
			"The dir /etc/plugins/plugin-test-custom-buttom cannot be removed.",
		);
	});
});
