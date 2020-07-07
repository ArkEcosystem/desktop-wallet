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

		const { container, asFragment, getAllByRole } = renderWithRouter(<SideBar items={items} />);

		expect(container).toBeTruthy();
		expect(getAllByRole("listitem").length).toEqual(3);
		expect(asFragment()).toMatchSnapshot();
	});
});
