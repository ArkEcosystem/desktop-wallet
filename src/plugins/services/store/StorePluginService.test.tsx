import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { PluginController, PluginManager } from "plugins/core";
import { PluginAPI } from "plugins/types";
import { env } from "utils/testing-library";

import { StorePluginService } from "./StorePluginService";

const config = { name: "test", version: "1.1", "desktop-wallet": { permissions: ["STORE"] } };

describe("StorePluginService", () => {
	let profile: Profile;
	let manager: PluginManager;
	let ctrl: PluginController;

	beforeEach(() => {
		profile = env.profiles().first();

		manager = new PluginManager();

		manager.services().register([new StorePluginService()]);
		manager.services().boot();
	});

	it("should persist values", () => {
		const fixture = (api: PluginAPI) => {
			api.store().data().set("theme", "dark");
			api.store().persist();
		};

		ctrl = new PluginController(config, fixture);
		ctrl.enable(profile);

		manager.plugins().push(ctrl);
		manager.plugins().runAllEnabled(profile);

		expect(profile.data().get(`plugins.${ctrl.config().id()}.store`)).toEqual({ theme: "dark" });
	});

	it("should restore values", () => {
		let result;

		const fixture = (api: PluginAPI) => {
			const current = api.store().data().get("theme");
			result = current;
		};

		ctrl = new PluginController(config, fixture);
		ctrl.enable(profile);

		manager.plugins().push(ctrl);
		manager.plugins().runAllEnabled(profile);

		expect(result).toBe("dark");
	});
});
