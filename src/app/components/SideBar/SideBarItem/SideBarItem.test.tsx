import React from "react";
import { act, fireEvent, renderWithRouter } from "testing-library";

import { SideBarItem } from "./SideBarItem";

const item = {
	label: "General",
	itemKey: "plugin",
	icon: "Plugin",
	route: "/settings/general",
	isActive: false,
};

describe("SideBarItem", () => {
	it("should render", () => {
		const { container, asFragment } = renderWithRouter(<SideBarItem {...item} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as active", () => {
		const { container, asFragment } = renderWithRouter(<SideBarItem {...item} isActive={true} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fire click event", () => {
		const handleActiveItem = jest.fn();

		const { getByTestId } = renderWithRouter(<SideBarItem {...item} handleActiveItem={handleActiveItem} />);
		const menuItem = getByTestId("side-menu__item--plugin");

		act(() => {
			fireEvent.click(menuItem);
		});

		expect(handleActiveItem).toHaveBeenCalledWith("plugin");
	});
});
