import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { PluginController, PluginManager } from "plugins/core";
import { PluginAPI } from "plugins/types";
import { env, getDefaultProfileId } from "utils/testing-library";

import { ProfilePluginService } from "./ProfilePluginService";

const config = {
	"desktop-wallet": { permissions: ["PROFILE"], urls: [] },
	name: "test",
	version: "1.1",
};

describe("ProfilePluginService", () => {
	let profile: Contracts.IProfile;
	let manager: PluginManager;
	let ctrl: PluginController;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());

		manager = new PluginManager();
		manager.services().register([new ProfilePluginService()]);
		manager.services().boot();
	});

	it("should get wallets", () => {
		let wallets;

		const fixture = (api: PluginAPI) => {
			wallets = api.profile().wallets();
		};

		ctrl = new PluginController(config, fixture);
		ctrl.enable(profile);

		manager.plugins().push(ctrl);
		manager.plugins().runAllEnabled(profile);

		expect(wallets).toHaveLength(2);
		// @ts-ignore
		expect(wallets[0].data.ADDRESS).toBe("D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD");
	});
});
