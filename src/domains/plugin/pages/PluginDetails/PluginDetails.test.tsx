import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import { StubStorage } from "tests/mocks";

import { PluginDetails } from "./PluginDetails";

describe("PluginDetails", () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const history = createMemoryHistory();
	const pluginDetailsURL = "/profiles/qwe123/plugins/wsx123";

	history.push(pluginDetailsURL);

	it("should render properly", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/plugins/:pluginId">
					<PluginDetails />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [pluginDetailsURL],
				history,
			},
		);

		expect(getByTestId("plugin-details__header")).toBeTruthy();
		expect(getByTestId("plugin-details__comments")).toBeTruthy();
		expect(getByTestId("plugin-details__review-box")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render properly as installed", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/plugins/:pluginId">
					<PluginDetails isInstalled />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [pluginDetailsURL],
				history,
			},
		);

		expect(getByTestId("plugin-details__header")).toBeTruthy();
		expect(getByTestId("plugin-details__comments")).toBeTruthy();
		expect(getByTestId("plugin-details__review-box")).toBeTruthy();
		expect(getByTestId("PluginHeader__button--uninstall")).toBeTruthy();
		expect(getByTestId("PluginHeader__button--open")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});
});
