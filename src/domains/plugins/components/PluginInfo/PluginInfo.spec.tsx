import { render } from "@testing-library/react";
import React from "react";

import { PluginInfo } from "./PluginInfo";

describe("PluginInfo", () => {
	const about =
		"Use the ARK Explorer to get full visibility of critical data from the ARK network. Data such as the latest blocks, wallet addresses and transactions. Plus monitor delegate status, their position and more.";
	const permissions = ["Embedded Webpages", "API Requests", "Access to Profiles"];

	it("should render properly", () => {
		const { asFragment, getByTestId, getAllByTestId } = render(
			<PluginInfo about={about} permissions={permissions} screenshots={[1, 2, 3]} />,
		);

		expect(getByTestId("plugin-info__about")).toHaveTextContent(about);
		expect(getByTestId("plugin-info__permissions")).toHaveTextContent(permissions.join(", "));
		expect(getByTestId("plugin-info__screenshots--pagination")).toBeTruthy();
		expect(getAllByTestId("plugin-info__screenshot")).toHaveLength(9);
		expect(asFragment()).toMatchSnapshot();
	});
});
w;
