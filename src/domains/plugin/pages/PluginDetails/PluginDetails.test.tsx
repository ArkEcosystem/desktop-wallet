import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { PluginController, PluginManager, PluginManagerProvider, usePluginManagerContext } from "plugins";
import React from "react";
import { Route } from "react-router-dom";
import { env, fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

import { PluginDetails } from "./PluginDetails";

describe("PluginDetails", () => {
	let manager: PluginManager;
	let profile: Profile;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		manager = new PluginManager();
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should render properly", async () => {
		const plugin = new PluginController(
			{ name: "test-plugin", "desktop-wallet": { categories: ["exchange"] } },
			() => void 0,
		);

		manager.plugins().push(plugin);

		const FetchComponent = () => {
			const { fetchPluginPackages } = usePluginManagerContext();
			return <button onClick={fetchPluginPackages}>Fetch Packages</button>;
		};

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins/details">
				<PluginManagerProvider manager={manager} services={[]}>
					<FetchComponent />
					<PluginDetails />
				</PluginManagerProvider>
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/plugins/details?pluginId=${plugin.config().id()}`],
			},
		);

		fireEvent.click(screen.getByText("Fetch Packages"));

		await waitFor(() => expect(screen.getAllByText("Test Plugin").length).toBeGreaterThan(0));

		expect(container).toMatchSnapshot();
	});
});
