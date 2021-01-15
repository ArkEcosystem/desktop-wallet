import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { PluginController, PluginManager } from "plugins/core";
import { PluginAPI } from "plugins/types";
import { env } from "utils/testing-library";

import { EventsPluginService } from "./EventsPluginService";

const config = {
	name: "test",
	version: "1.1",
	"desktop-wallet": { permissions: ["EVENTS"] },
};

describe("EventsPluginService", () => {
	let profile: Profile;
	let manager: PluginManager;
	let ctrl: PluginController;

	beforeEach(() => {
		profile = env.profiles().first();

		manager = new PluginManager();
		manager.services().register([new EventsPluginService()]);
		manager.services().boot();
	});

	it("should listen for events", () => {
		let ready = false;

		const fixture = (api: PluginAPI) => {
			api.events().on("activated", () => (ready = true));
		};

		ctrl = new PluginController(config, fixture);
		ctrl.enable(profile);

		manager.plugins().push(ctrl);
		manager.plugins().runAllEnabled(profile);

		expect(ready).toBe(true);
	});
});
