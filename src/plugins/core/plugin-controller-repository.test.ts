import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { env, getDefaultProfileId } from "utils/testing-library";

import { container } from "./plugin-container";
import { PluginController } from "./plugin-controller";
import { PluginControllerRepository } from "./plugin-controller-repository";
import { PluginServiceRepository } from "./plugin-service-repository";

describe("Plugin Controller subject", () => {
	let profile: Profile;
	let subject: PluginControllerRepository;

	beforeEach(() => {
		container.set("services", new PluginServiceRepository());
		subject = new PluginControllerRepository();
		profile = env.profiles().findById(getDefaultProfileId());
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should return all", () => {
		subject.push(new PluginController({ name: "plugin-test" }, () => void 0));
		expect(subject.all().length).toBe(1);
	});

	it("should remove by id", () => {
		const plugin = new PluginController({ name: "plugin-test" }, () => void 0);
		subject.push(plugin);
		expect(subject.all().length).toBe(1);

		subject.removeById(plugin.config().id(), profile);
		expect(subject.all().length).toBe(0);
	});

	it("should filter by category", () => {
		const plugin1 = new PluginController({ name: "plugin-test1" }, () => void 0);
		const plugin2 = new PluginController(
			{ name: "plugin-test2", "desktop-wallet": { categories: ["exchange"] } },
			() => void 0,
		);
		subject.push(plugin1);
		subject.push(plugin2);

		expect(subject.filterByCategory("exchange").length).toBe(1);
	});

	it("should check if plugin has filters", () => {
		const plugin = new PluginController({ name: "plugin-test" }, () => void 0);
		plugin.hooks().addFilter("test", "plus", () => 1);
		subject.push(plugin);
		expect(subject.hasFilters("test", "plus")).toBe(true);
	});

	it("should not run all enabled if it is already running", () => {
		const plugin = new PluginController({ name: "plugin-test" }, () => void 0);
		subject.push(plugin);
		subject.runAllEnabled(profile);
		expect(() => subject.runAllEnabled(profile)).toThrowError();
	});

	it("should fail to dispose if not running", () => {
		expect(() => subject.dispose()).toThrowError();
	});

	it("should dispose", () => {
		const plugin = new PluginController({ name: "plugin-test" }, () => void 0);

		subject.push(plugin);

		plugin.enable(profile);

		subject.runAllEnabled(profile);
		subject.dispose();

		expect(subject.currentProfile()).toBeUndefined();
	});

	it("should fill multiple plugins", () => {
		const consoleMock = jest.spyOn(console, "error").mockImplementation();
		subject.fill([
			{
				config: { name: "plugin1", keywords: ["@arkecosystem", "desktop-wallet"] },
				dir: "/plugin1",
				source: "module.exports = () => void 0",
				sourcePath: "/plugin1/index.js",
			},
			{
				config: {},
				dir: "/plugin2",
				source: "module.exports = () => void 0",
				sourcePath: "/plugin2/index.js",
			},
		]);
		expect(consoleMock).toHaveBeenCalledWith(
			`Failed to parse the plugin from "/plugin2".`,
			"name is a required field",
		);
		expect(subject.all().length).toBe(1);
	});
});
