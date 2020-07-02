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
				path: "/portfolio",
			},
			{
				title: "test",
				path: "/test",
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

	it("should handle menu click", () => {
		const menu = [
			{
				title: "Portfolio",
				path: "/portfolio",
			},
			{
				title: "test",
				path: "/test",
			},
		];
		const { container, asFragment, getByText } = render(
			<Router history={history}>
				<NavigationBar menu={menu} />
			</Router>,
		);

		expect(container).toBeTruthy();
		fireEvent.click(getByText("Portfolio"));
		expect(history.location.pathname).toEqual("/portfolio");
		expect(asFragment()).toMatchSnapshot();
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
});
