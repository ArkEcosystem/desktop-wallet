import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { LaunchPluginService, PluginManagerProvider } from "plugins";
import { PluginController, PluginManager } from "plugins/core";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

import { PluginView } from "./PluginView";

describe("Plugin View", () => {
	let manager: PluginManager;
	let profile: Profile;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		manager = new PluginManager();
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should render plugin content", async () => {
		const plugin = new PluginController(
			{ name: "test-plugin", "desktop-wallet": { permissions: ["LAUNCH"] } },
			(api) => api.launch().render(<h1>My Plugin View</h1>),
		);

		manager.services().register([new LaunchPluginService()]);
		manager.plugins().push(plugin);

		plugin.enable(profile, { autoRun: true });

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins/:pluginId/view">
				<PluginManagerProvider manager={manager} services={[]}>
					<PluginView />
				</PluginManagerProvider>
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/plugins/${plugin.config().id()}/view`],
			},
		);

		await waitFor(() => expect(screen.queryByText("My Plugin View")).toBeInTheDocument());

		expect(container).toMatchSnapshot();
	});
});
