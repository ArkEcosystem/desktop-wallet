import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { act } from "react-dom/test-utils";
import { Route } from "react-router-dom";
import { fireEvent, renderWithRouter } from "testing-library";
import { env } from "utils/testing-library";

import { NavigationBar } from "./NavigationBar";

describe("NavigationBar", () => {
	const history = createMemoryHistory();
	let profile: Profile;

	beforeAll(() => {
		profile = env.profiles().create("Jane Doe");
	});

	afterAll(() => {
		env.profiles().forget(profile.id());
	});

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

	it("should render without profile", () => {
		const dashboardURL = `/profiles/nonexistent-id/dashboard`;
		history.push(dashboardURL);

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<NavigationBar />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toBeInTheDocument();
	});

	it("should handle default menu", () => {
		const dashboardURL = `/profiles/${profile.id()}/dashboard`;
		history.push(dashboardURL);

		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<NavigationBar />
			</Route>,
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
			<Route path="/profiles/:profileId/dashboard">
				<NavigationBar menu={menu} />
			</Route>,
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
			<Route path="/profiles/:profileId/dashboard">
				<NavigationBar />
			</Route>,
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
			<Route path="/profiles/:profileId/dashboard">
				<NavigationBar />
			</Route>,
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
			<Route path="/profiles/:profileId/dashboard">
				<NavigationBar />
			</Route>,
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
			<Route path="/profiles/:profileId/dashboard">
				<NavigationBar />
			</Route>,
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
		expect(history.location.pathname).toMatch(`/`);
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
