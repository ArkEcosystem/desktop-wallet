const { PluginLoader } = require("./loader");
const path = require("path");
const os = require("os");

describe("PluginLoader", () => {
	let subject: typeof PluginLoader;

	beforeEach(() => {
		subject = new PluginLoader([path.resolve(".plugins")]);
	});

	it("should find manifests file in the folder", () => {
		expect(subject.findManifestsPath()).toEqual([
			path.resolve(".plugins", "custom-main/package.json"),
			path.resolve(".plugins", "custom-route/package.json"),
			path.resolve(".plugins", "custom-theme/package.json"),
			path.resolve(".plugins", "hello/package.json"),
		]);
	});

	it("should load manifests files from paths", () => {
		const example = path.resolve(".plugins", "hello/package.json");
		const wrong = path.resolve(".plugins", "nonexistent/package.json");

		expect(subject.loadManifestsFromPaths([example, wrong])).toEqual([
			{
				dir: path.resolve(".plugins", "hello"),
				manifest: {
					name: "hello-plugin",
					permission: ["PROFILE"],
				},
			},
		]);
	});

	it("should read plugins from manifests", () => {
		const customMainPlugin = path.resolve(".plugins", "custom-main/package.json");
		const helloPlugin = path.resolve(".plugins", "hello/package.json");

		const assets = subject.loadManifestsFromPaths([customMainPlugin, helloPlugin]);
		const result = subject.readEntryFromManifests(assets);
		expect(result).toHaveLength(2);
		expect(result[0].entryPath).toBeTruthy();
		expect(result[0].entryCode).toBeTruthy();
		expect(result[0].manifest).toBeTruthy();
	});

	it("should load plugins", () => {
		const result = subject.load();
		expect(result).toHaveLength(4);
		expect(result[0].entryPath).toBeTruthy();
		expect(result[0].entryCode).toBeTruthy();
		expect(result[0].manifest).toBeTruthy();
	});
});
