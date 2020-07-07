import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { act } from "react-dom/test-utils";
import { Route } from "react-router-dom";
import { fireEvent, renderWithRouter } from "testing-library";

import { NavigationBar } from "./NavigationBar";

describe("NavigationBar", () => {
	const history = createMemoryHistory();
	const env = new Environment({ coins: { ARK }, httpClient, storage: "localstorage" });

	it("should render", () => {
		const { container, asFragment } = renderWithRouter(<NavigationBar />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom menu", () => {
		const menu = [
			{
				title: "Portfolio",
				mountPath: (profileId) => `/profiles/${profileId}/dashboard`,
			},
			{
				title: "test",
				mountPath: () => "/test",
			},
		];
		const { container, asFragment } = renderWithRouter(<NavigationBar menu={menu} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle default menu", () => {
		const profile = env.profiles().create("test");
		history.push(`/profiles/${profile.id()}/dashboard`);

		const { getByText } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<NavigationBar />
				</Route>
			</EnvironmentContext.Provider>,
		);

		expect(getByText("Portfolio")).toBeTruthy();
	});

	it("should handle menu click", () => {
		const menu = [
			{
				title: "Portfolio",
				mountPath: (profileId) => `/profiles/${profileId}/dashboard`,
			},
			{
				title: "test",
				mountPath: () => "/test",
			},
		];
		const profile = env.profiles().create("test2");
		history.push(`/profiles/${profile.id()}`);
		const { getByText } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<NavigationBar menu={menu} />
				</Route>
			</EnvironmentContext.Provider>,
		);

		fireEvent.click(getByText("Portfolio"));
		expect(history.location.pathname).toEqual(`/profiles/${profile.id()}/dashboard`);
	});

	it("should open user actions dropdown on click", () => {
		const options = [
			{ label: "Option 1", value: "/test" },
			{ label: "Option 2", value: "/test2" },
		];
		const { getByTestId, getByText } = renderWithRouter(<NavigationBar userActions={options} />);
		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByText("Option 1")).toBeTruthy();
		fireEvent.click(getByText("Option 1"));
		expect(history.location.pathname).toMatch("/profiles/");
	});

	it("should not render if no active profile", () => {
		const options = [
			{ label: "Option 1", value: "/test" },
			{ label: "Option 2", value: "/test2" },
		];

		const menu = [
			{
				title: "Portfolio",
				mountPath: (profileId) => `/profiles/${profileId}/dashboard`,
			},
			{
				title: "test",
				mountPath: () => "/test",
			},
		];

		const { asFragment } = renderWithRouter(<NavigationBar menu={menu} userActions={options} />);
		expect(asFragment()).toMatchSnapshot();
	});
});
