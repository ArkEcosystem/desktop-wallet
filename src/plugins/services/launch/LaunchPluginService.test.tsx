import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { PluginController, PluginManager } from "plugins/core";
import { PluginAPI } from "plugins/types";
import React from "react";
import { env, render } from "utils/testing-library";

import { LaunchRender } from "./LaunchPluginComponent";
import { LaunchPluginService } from "./LaunchPluginService";

const config = {
	name: "test",
	version: "1.1",
	"desktop-wallet": { permissions: ["LAUNCH"], urls: [] },
};
const fixture = (api: PluginAPI) => api.launch().render(<h1>My Plugin</h1>);

describe("LaunchPluginService", () => {
	let profile: Contracts.IProfile;
	let manager: PluginManager;
	let ctrl: PluginController;

	beforeEach(() => {
		profile = env.profiles().first();

		manager = new PluginManager();
		manager.services().register([new LaunchPluginService()]);
		manager.services().boot();

		ctrl = new PluginController(config, fixture);
		ctrl.enable(profile);
	});

	it("should render", () => {
		manager.plugins().push(ctrl);
		manager.plugins().runAllEnabled(profile);

		const Component = () => <LaunchRender manager={manager} pluginId={ctrl.config().id()} />;

		render(<Component />);
		// @TODO: proper expectation
		// expect(screen.getByText("My Plugin"));
	});

	it("should render fallback", () => {
		const Component = () => (
			<LaunchRender manager={manager} pluginId={ctrl.config().id()} fallback={<h1>Not Loaded</h1>} />
		);

		render(<Component />);
		// @TODO: proper expectation
		// expect(screen.getByText("Not Loaded"));
	});
});
