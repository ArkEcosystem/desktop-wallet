import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import { identity } from "tests/fixtures/identity";

import { PluginDetails } from "./PluginDetails";

describe("PluginDetails", () => {
	const history = createMemoryHistory();
	const pluginDetailsURL = `/profiles/${identity.profiles.bob.id}/plugins/wsx123`;

	history.push(pluginDetailsURL);

	it("should render properly", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins/:pluginId">
				<PluginDetails />
			</Route>,
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
			<Route path="/profiles/:profileId/plugins/:pluginId">
				<PluginDetails isInstalled />
			</Route>,
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
