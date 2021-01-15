import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import { PluginManagerProvider } from "plugins/context";
import { PluginManager } from "plugins/core";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter, waitFor } from "utils/testing-library";

import { PluginRouterWrapper } from "./PluginRouterWrapper";

describe("PluginRouterWrapper", () => {
	let profile: Profile;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should boot and dispose plugins when changing the profile", async () => {
		const pluginManager = new PluginManager();
		const bootSpy = jest.spyOn(pluginManager.plugins(), "runAllEnabled");
		const disposeSpy = jest.spyOn(pluginManager.plugins(), "dispose");

		const history = createMemoryHistory();
		history.push(`/profiles/${profile.id()}`);

		const Component = () => (
			<Route path="/profiles/:profileId">
				<PluginManagerProvider manager={pluginManager} services={[]}>
					<PluginRouterWrapper>
						<span>Hello</span>
					</PluginRouterWrapper>
				</PluginManagerProvider>
			</Route>
		);

		renderWithRouter(<Component />, { history });
		await waitFor(() => expect(bootSpy).toHaveBeenCalledTimes(1));

		history.push(`/profiles/nonexistent`);
		renderWithRouter(<Component />, { history });
		await waitFor(() => expect(disposeSpy).toHaveBeenCalledTimes(1));
	});
});
