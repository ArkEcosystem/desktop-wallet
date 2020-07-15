import React from "react";
import { render } from "testing-library";

import { PluginInfo } from "./PluginInfo";

describe("PluginInfo", () => {
	it("should render properly", () => {
		const about = "Testing About text content";
		const permissions = ["Embedded Webpages", "API Requests", "Access to Profiles"];

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
