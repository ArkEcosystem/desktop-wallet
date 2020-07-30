import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, renderWithRouter } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { PluginDetails } from "./PluginDetails";

const history = createMemoryHistory();

const fixtureProfileId = "b999d134-7a24-481e-a95d-bc47c543bfc9";
const pluginDetailsURL = `/profiles/${fixtureProfileId}/plugins/wsx123`;

describe("PluginDetails", () => {
	beforeAll(async () => {
		await env.bootFromObject(fixtureData);
		await env.persist();

		history.push(pluginDetailsURL);
	});

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
