import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { PluginController, PluginManager } from "plugins/core";
import { PluginAPI } from "plugins/types";
import { env, waitFor } from "utils/testing-library";

import { TimersPluginService } from "./TimersPluginService";

const config = { name: "test", version: "1.1", "desktop-wallet": { permissions: ["TIMERS"] } };

describe("TimersPluginService", () => {
	let profile: Profile;
	let manager: PluginManager;
	let ctrl: PluginController;

	beforeEach(() => {
		profile = env.profiles().first();

		manager = new PluginManager();

		manager.services().register([new TimersPluginService()]);
		manager.services().boot();
	});

	it("should run periodic", async () => {
		jest.useFakeTimers();

		let test = 0;
		const fixture = (api: PluginAPI) => {
			const timer = api.timers().setInterval(() => (test = test + 1), 200);
			const timer2 = api.timers().setTimeout(() => (test = 300), 100);
			api.timers().clearTimeout(timer2);
			api.timers().setTimeout(() => api.timers().clearInterval(timer), 1000);
		};

		manager.plugins().push(ctrl);

		ctrl = new PluginController(config, fixture);
		ctrl.enable(profile, { autoRun: true });

		await waitFor(() => expect(test).toBe(5));

		jest.useRealTimers();
	});
});
