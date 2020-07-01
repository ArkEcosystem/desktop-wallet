import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import { fireEvent, render } from "test-utils";

import { NavigationBar } from "./NavigationBar";

describe("NavigationBar", () => {
	it("should render", () => {
		const { container, asFragment } = render(
			<Router>
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
			<Router>
				<NavigationBar menu={menu} />
			</Router>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open user actions dropdown on click", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: -"2" },
		];
		const { getByTestId, getByText } = render(
			<Router>
				<NavigationBar userActions={options} />
			</Router>,
		);
		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});
		expect(getByText("Option 1")).toBeTruthy();
	});
});
