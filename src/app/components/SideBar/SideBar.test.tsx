import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { SideBar } from "./SideBar";

describe("SideBar", () => {
	it("should render empty", () => {
		const { container, asFragment } = render(<SideBar />, { wrapper: MemoryRouter });

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with items", () => {
		const items = [
			{
				key: "general",
				label: "General",
				icon: "General",
				route: "/settings/general",
			},
			{
				key: "peer",
				label: "Peer",
				icon: "Peer",
				route: "/settings/peer",
			},
			{
				key: "plugins",
				label: "Plugins",
				icon: "Plugin",
				route: "/settings/plugins",
			},
		];

		const { container, asFragment, getAllByRole } = render(<SideBar items={items} />, { wrapper: MemoryRouter });

		expect(container).toBeTruthy();
		expect(getAllByRole("listitem").length).toEqual(3);
		expect(asFragment()).toMatchSnapshot();
	});
});
