import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, renderWithRouter } from "testing-library";

import { NavigationBar } from "./NavigationBar";

describe("NavigationBar", () => {
	it("should render", () => {
		const { container, asFragment } = renderWithRouter(<NavigationBar />);

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
		const { container, asFragment } = renderWithRouter(<NavigationBar menu={menu} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open user actions dropdown on click", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: -"2" },
		];
		const { getByTestId, getByText } = renderWithRouter(<NavigationBar userActions={options} />);
		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});
		expect(getByText("Option 1")).toBeTruthy();
	});
});
