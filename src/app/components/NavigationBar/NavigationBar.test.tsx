import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { act } from "react-dom/test-utils";
import { Route } from "react-router-dom";
import { fireEvent, renderWithRouter } from "testing-library";
import { StubStorage } from "tests/mocks";

import { NavigationBar } from "./NavigationBar";

describe("NavigationBar", () => {
	const history = createMemoryHistory();
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const profile = env.profiles().create("Jane Doe");

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
		const dashboardURL = `/profiles/${profile.id()}/dashboard`;
		history.push(dashboardURL);

		const { getByText } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<NavigationBar />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByText("Portfolio")).toBeTruthy();
	});

	it("should handle menu click", () => {
		const dashboardURL = `/profiles/${profile.id()}/dashboard`;
		history.push(dashboardURL);

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

		const { getByText } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<NavigationBar menu={menu} />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		fireEvent.click(getByText("Portfolio"));
		expect(history.location.pathname).toEqual(`/profiles/${profile.id()}/dashboard`);
	});

	it("should open user actions dropdown on click", () => {
		const options = [
			{ label: "Option 1", value: "/test", mountPath: () => "/test" },
			{ label: "Option 2", value: "/test2", mountPath: () => "/test" },
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

	it("should handle contacts click on user actions dropdown", async () => {
		const dashboardURL = `/profiles/${profile.id()}/dashboard`;
		history.push(dashboardURL);

		const { getByTestId, findByText } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<NavigationBar />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(await findByText("Contacts")).toBeTruthy();
		fireEvent.click(await findByText("Contacts"));
		expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/contacts`);
	});

	it("should handle settings click on user actions dropdown", async () => {
		const dashboardURL = `/profiles/${profile.id()}/dashboard`;
		history.push(dashboardURL);

		const { getByTestId, findByText } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<NavigationBar />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(await findByText("Settings")).toBeTruthy();
		fireEvent.click(await findByText("Settings"));
		expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/settings`);
	});

	it("should handle support click on user actions dropdown", async () => {
		const dashboardURL = `/profiles/${profile.id()}/dashboard`;
		history.push(dashboardURL);

		const { getByTestId, findByText } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<NavigationBar />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(await findByText("Support")).toBeTruthy();
		fireEvent.click(await findByText("Support"));
		expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/support`);
	});

	it("should handle exit click on user actions dropdown", async () => {
		const dashboardURL = `/profiles/${profile.id()}/dashboard`;
		history.push(dashboardURL);

		const { getByTestId, findByText } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<NavigationBar />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(await findByText("Exit")).toBeTruthy();
		fireEvent.click(await findByText("Exit"));
		expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/exit`);
	});

	it("should not render if no active profile", () => {
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

		const { asFragment } = renderWithRouter(<NavigationBar menu={menu} />);
		expect(asFragment()).toMatchSnapshot();
	});
});
