import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { EventsPluginService } from "plugins/services";
import { env, getDefaultProfileId } from "utils/testing-library";

import { PluginController } from "../plugin-controller";
import { PluginServiceData } from "../plugin-service";
import { isPluginEnabled, isServiceDefinedInConfig } from "./plugin-permission";

describe("Plugin Permissions", () => {
	let profile: Profile;
	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should log plugin not enabled", () => {
		const plugin = new PluginController({ name: "plugin-test" }, () => void 0);
		const service = new PluginServiceData(new EventsPluginService());
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();

		const protectedFn = isPluginEnabled({ service, plugin, profile })("result");
		protectedFn();

		expect(consoleSpy).toHaveBeenCalledWith("The plugin plugin-test is not enabled by the current profile.");
	});

	it("should log service not defined", () => {
		const plugin = new PluginController({ name: "plugin-test" }, () => void 0);
		const service = new PluginServiceData(new EventsPluginService());
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();

		const protectedFn = isServiceDefinedInConfig({ service, plugin, profile })("result");
		protectedFn();

		expect(consoleSpy).toHaveBeenCalledWith("The plugin plugin-test did not define EVENTS its permissions.");
	});
});
