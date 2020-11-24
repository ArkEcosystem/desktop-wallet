import path from "path";

import { PluginLoaderFileSystem } from "./loader-fs";

describe("PluginLoaderFileSystem", () => {
	let subject: PluginLoaderFileSystem;
	let root: string;

	beforeEach(() => {
		root = path.resolve("src/tests/fixtures/plugins");
		subject = new PluginLoaderFileSystem([root]);
	});

	it("should find manifests file in the folder", () => {
		expect(subject.search()).toHaveLength(3);
	});
});
