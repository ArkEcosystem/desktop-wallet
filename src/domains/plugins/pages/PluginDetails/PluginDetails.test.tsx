import { render } from "@testing-library/react";
import React from "react";

import { PluginDetails } from "./PluginDetails";

describe("PluginDetails", () => {
	it("should render properly", () => {
		const { asFragment } = render(<PluginDetails />);

		expect(asFragment()).toMatchSnapshot();
	});
});
