import { AppContext } from "app/contexts";
import { createMemoryHistory } from "history";
import React from "react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { fireEvent, render } from "testing-library";

import { NavigationBar } from "./NavigationBar";

describe("NavigationBar", () => {
	const history = createMemoryHistory();

	it("should render", () => {
		const { container, asFragment } = render(
			<AppContext.Provider>
				<Router history={history}>
					<NavigationBar />
				</Router>
			</AppContext.Provider>,
		);

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
		const { container, asFragment } = render(
			<AppContext.Provider>
				<Router history={history}>
					<NavigationBar menu={menu} />
				</Router>
				,
			</AppContext.Provider>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
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
		const { container, asFragment, getByText } = render(
			<AppContext.Provider>
				<Router history={history}>
					<NavigationBar menu={menu} />
				</Router>
				,
			</AppContext.Provider>,
		);

		expect(container).toBeTruthy();
		fireEvent.click(getByText("Portfolio"));
		expect(history.location.pathname).toEqual("/profiles/123/dashboard");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open user actions dropdown on click", () => {
		const options = [
			{ label: "Option 1", value: "/test" },
			{ label: "Option 2", value: "/test2" },
		];
		const { getByTestId, getByText } = render(
			<AppContext.Provider>
				<Router history={history}>
					<NavigationBar userActions={options} />
				</Router>
			</AppContext.Provider>,
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
				mountPath: (profileId) => `/profiles/${profileId}/dashboard`,
			},
			{
				title: "test",
				mountPath: () => "/test",
			},
		];

		const { asFragment } = render(
			<AppContext.Provider value={{ appContext: null }}>
				<Router history={history}>
					<NavigationBar menu={menu} userActions={options} />
				</Router>
			</AppContext.Provider>,
		);
		expect(asFragment()).toMatchSnapshot();
	});
});
