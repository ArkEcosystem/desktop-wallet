import React from "react";
import { renderWithRouter } from "testing-library";

import { SideBar } from "./SideBar";

describe("SideBar", () => {
	it("should render empty", () => {
		const { container, asFragment } = renderWithRouter(<SideBar />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with items", () => {
		const items = [
			{
				icon: "General",
				key: "general",
				label: "General",
				route: "/settings/general",
			},
			{
				icon: "Peer",
				key: "peer",
				label: "Peer",
				route: "/settings/peer",
			},
			{
				icon: "Plugin",
				key: "plugins",
				label: "Plugins",
				route: "/settings/plugins",
			},
		];

		const { container, asFragment, getAllByRole } = renderWithRouter(<SideBar items={items} />);

		expect(container).toBeTruthy();
		expect(getAllByRole("listitem").length).toEqual(3);
		expect(asFragment()).toMatchSnapshot();
	});
});
