import { act, fireEvent, render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { SideBarItem } from "./";

describe("SideBarItem", () => {
	const item = {
		label: "General",
		itemKey: "plugin",
		icon: "Plugin",
		route: "/settings/general",
		isActive: false,
	};

	it("should render", () => {
		const { container, asFragment } = render(<SideBarItem {...item} />, { wrapper: MemoryRouter });

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as active", () => {
		const { container, asFragment } = render(<SideBarItem {...item} isActive={true} />, { wrapper: MemoryRouter });

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fire click event", () => {
		const handleActiveItem = jest.fn();

		const { getByTestId } = render(<SideBarItem {...item} handleActiveItem={handleActiveItem} />, {
			wrapper: MemoryRouter,
		});
		const menuItem = getByTestId("side-menu__item--plugin");

		act(() => {
			fireEvent.click(menuItem);
		});

		expect(handleActiveItem).toHaveBeenCalledWith("plugin");
	});
});
