import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { act } from "react-dom/test-utils";
import { Route, Router } from "react-router-dom";
import { fireEvent, render } from "testing-library";

import { NavigationBar } from "./NavigationBar";

describe("NavigationBar", () => {
	const history = createMemoryHistory();
	const env = new Environment({ coins: { ARK }, httpClient, storage: "indexeddb" });

	it("should render", () => {
		const { container, asFragment } = render(
			<Router history={history}>
				<NavigationBar />
			</Router>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom menu", () => {
		const menu = [
			{
				title: "Portfolio",
				mountPath: (profileId) => `/profiles/${profileId}/portfolio`,
			},
			{
				title: "test",
				mountPath: () => "/test",
			},
		];
		const { container, asFragment } = render(
			<Router history={history}>
				<NavigationBar menu={menu} />
			</Router>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle default menu", () => {
		const profile = env.profiles().create("test");
		history.push(`/profiles/${profile.id()}`);
		const { getByText } = render(
			<Router history={history}>
				<EnvironmentContext.Provider value={env}>
					<Route path="/profiles/:profileId">
						<NavigationBar />
					</Route>
				</EnvironmentContext.Provider>
			</Router>,
		);

		expect(getByText("Portfolio")).toBeTruthy();
	});

	it("should handle menu click", () => {
		const menu = [
			{
				title: "Portfolio",
				mountPath: (profileId) => `/profiles/${profileId}/portfolio`,
			},
			{
				title: "test",
				mountPath: () => "/test",
			},
		];
		const profile = env.profiles().create("test2");
		history.push(`/profiles/${profile.id()}`);
		const { getByText } = render(
			<Router history={history}>
				<EnvironmentContext.Provider value={env}>
					<Route path="/profiles/:profileId">
						<NavigationBar menu={menu} />
					</Route>
				</EnvironmentContext.Provider>
			</Router>,
		);

		fireEvent.click(getByText("Portfolio"));
		expect(history.location.pathname).toEqual(`/profiles/${profile.id()}/portfolio`);
	});

	it("should open user actions dropdown on click", () => {
		const options = [
			{ label: "Option 1", value: "/test" },
			{ label: "Option 2", value: "/test2" },
		];
		const { getByTestId, getByText } = render(
			<Router history={history}>
				<NavigationBar userActions={options} />
			</Router>,
		);
		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByText("Option 1")).toBeTruthy();
		fireEvent.click(getByText("Option 1"));
		expect(history.location.pathname).toEqual("/test");
	});

	it("should not render if no active profile", () => {
		const options = [
			{ label: "Option 1", value: "/test" },
			{ label: "Option 2", value: "/test2" },
		];

		const menu = [
			{
				title: "Portfolio",
				mountPath: (profileId) => `/profiles/${profileId}/portfolio`,
			},
			{
				title: "test",
				mountPath: () => "/test",
			},
		];

		const { asFragment } = render(
			<Router history={history}>
				<NavigationBar menu={menu} userActions={options} />
			</Router>,
		);
		expect(asFragment()).toMatchSnapshot();
	});
});
