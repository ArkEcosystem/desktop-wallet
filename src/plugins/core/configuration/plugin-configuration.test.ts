import path from "path";

import { PluginConfigurationData } from "./plugin-configuration";

describe("Plugin Configuration", () => {
	it("should validate successful", () => {
		const subject = PluginConfigurationData.make({
			name: "plugin-test",
			keywords: ["@arkecosystem", "desktop-wallet"],
		});
		expect(subject.validate()).toBeTruthy();
	});

	it("should fail to validate", () => {
		const subject = PluginConfigurationData.make({ version: 1 });
		expect(() => subject.validate()).toThrowError();
	});

	it("should format title with scope", () => {
		const subject = PluginConfigurationData.make({ name: "@arkecosystem/plugin-test" });
		expect(subject.title()).toBe("Plugin Test");
	});

	it("should format title", () => {
		const subject = PluginConfigurationData.make({ name: "plugin-test" });
		expect(subject.title()).toBe("Plugin Test");
	});

	it("should format a custom title", () => {
		const subject = PluginConfigurationData.make({ name: "plugin-test", "desktop-wallet": { title: "My Plugin" } });
		expect(subject.title()).toBe("My Plugin");
	});

	it("should format id", () => {
		const subject1 = PluginConfigurationData.make({ name: "@arkecosystem/plugin-test" });
		expect(subject1.id()).toBe("@arkecosystem/plugin-test");

		const subject2 = PluginConfigurationData.make({ name: "@arkecosystem/plugin-explorer" });
		expect(subject2.id()).toBe("@arkecosystem/plugin-explorer");
	});

	it("should return author if official scope", () => {
		const subject = PluginConfigurationData.make({ name: "@arkecosystem/plugin-test" });
		expect(subject.author()).toBe("ARK Ecosystem");
	});

	it("should return unknown author if not defined", () => {
		const subject = PluginConfigurationData.make({ name: "plugin-test" });
		expect(subject.author()).toBe("Unknown");
	});

	it("should return author", () => {
		const subject = PluginConfigurationData.make({ name: "plugin-test", author: "Jhon" });
		expect(subject.author()).toBe("Jhon");
	});

	it("should return author with object", () => {
		const subject = PluginConfigurationData.make({ name: "plugin-test", author: { name: "Jhon" } });
		expect(subject.author()).toBe("Jhon");
	});

	it("should return author from contributors", () => {
		const subject = PluginConfigurationData.make({ name: "plugin-test", contributors: [{ name: "Jhon" }] });
		expect(subject.author()).toBe("Jhon");
	});

	it("should return author from contributors with array of strings", () => {
		const subject = PluginConfigurationData.make({ name: "plugin-test", contributors: ["Jhon"] });
		expect(subject.author()).toBe("Jhon");
	});

	it("should return default version", () => {
		const subject = PluginConfigurationData.make({ name: "plugin-test" });
		expect(subject.version()).toBe("0.0.0");
	});

	it("should return custom version", () => {
		const subject = PluginConfigurationData.make({ name: "plugin-test", version: "1.2.3" });
		expect(subject.version()).toBe("1.2.3");
	});

	it("should return keywords", () => {
		const subject = PluginConfigurationData.make({
			name: "plugin-test",
			keywords: ["desktop", "plugin", "desktop-wallet"],
		});
		expect(subject.keywords()).toEqual(["Desktop", "Plugin", "Desktop Wallet"]);
	});

	it("should return permissions", () => {
		const subject = PluginConfigurationData.make({
			name: "plugin-test",
			"desktop-wallet": { permissions: ["LAUNCH", "HTTP"] },
		});
		expect(subject.permissions()).toEqual(["LAUNCH", "HTTP"]);
	});

	it("should return urls", () => {
		const subject = PluginConfigurationData.make({
			name: "plugin-test",
			"desktop-wallet": { urls: ["http://github.com"] },
		});
		expect(subject.urls()).toEqual(["http://github.com"]);
	});

	it("should return default category if not defined", () => {
		const subject = PluginConfigurationData.make({ name: "plugin-test" });
		expect(subject.categories()).toEqual(["other"]);
	});

	it("should return valid categories", () => {
		const subject = PluginConfigurationData.make({
			name: "plugin-test",
			"desktop-wallet": { categories: ["exchange", "finance"] },
		});
		expect(subject.categories()).toEqual(["exchange"]);
	});

	it("should return other categories if categories is empty", () => {
		const subject = PluginConfigurationData.make({
			name: "plugin-test",
			"desktop-wallet": { categories: [] },
		});
		expect(subject.categories()).toEqual(["other"]);
	});

	it("should return plugin size from fs", async () => {
		const subject = PluginConfigurationData.make(
			{ name: "plugin-test" },
			path.resolve("src/tests/fixtures/plugins/packages/plugin-test-custom-buttom"),
		);
		await new Promise((r) => setTimeout(r, 100));
		expect(subject.size()).toBe("0 B");
	});

	it("should return plugin size from package", async () => {
		const subject1 = PluginConfigurationData.make({ name: "plugin-test" });
		const subject2 = PluginConfigurationData.make({ name: "plugin-test", dist: { unpackedSize: 15000 } });

		await subject1.syncSize();
		await subject2.syncSize();

		expect(subject1.size()).toBe("0 B");
		expect(subject2.size()).toBe("15 kB");
	});

	it("should return logo", () => {
		const subject = PluginConfigurationData.make({
			name: "plugin-test",
			logo: "https://raw.githubusercontent.com/ark-ecosystem-desktop-plugins/sound-notifications/master/logo.png",
		});

		expect(subject.logo()).toBe(
			"https://raw.githubusercontent.com/ark-ecosystem-desktop-plugins/sound-notifications/master/logo.png",
		);
	});

	it("should return logo from manifest", () => {
		const subject = PluginConfigurationData.make({
			name: "plugin-test",
			"desktop-wallet": {
				logo:
					"https://raw.githubusercontent.com/ark-ecosystem-desktop-plugins/sound-notifications/master/logo.png",
			},
		});

		expect(subject.logo()).toBe(
			"https://raw.githubusercontent.com/ark-ecosystem-desktop-plugins/sound-notifications/master/logo.png",
		);
	});

	it("should not return invalid logo", () => {
		const subject = PluginConfigurationData.make({
			name: "plugin-test",
			"desktop-wallet": { logo: "https://google.com" },
		});
		expect(subject.logo()).toBeUndefined();
	});

	it("should return is not official", () => {
		const subject = PluginConfigurationData.make({});
		expect(subject.isOfficial()).toBe(false);
	});

	it("should return true for existing category", () => {
		const subject = PluginConfigurationData.make({ "desktop-wallet": { categories: ["exchange"] } });
		expect(subject.hasCategory("exchange")).toBe(true);
	});

	it("should return to object", () => {
		const subject = PluginConfigurationData.make({
			description: "The Plugin",
			name: "plugin-test",
			version: "0.0.1",
		});
		expect(subject.toObject()).toMatchObject({
			description: "The Plugin",
			name: "plugin-test",
			version: "0.0.1",
		});
	});
});
