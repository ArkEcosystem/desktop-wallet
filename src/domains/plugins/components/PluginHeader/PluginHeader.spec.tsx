import { render } from "@testing-library/react";
import React from "react";

import { PluginHeader } from "./PluginHeader";

describe("PluginHeader", () => {
	it("should render properly", () => {
		const { asFragment, getByRole, getByText } = render(
			<PluginHeader
				author="ARK Ecosystem"
				category="Utility"
				url="github.com"
				rating="4.6"
				version="1.3.8"
				size="4.2"
			/>,
		);

		expect(getByRole("img")).toBeTruthy();
		expect(getByText("ARK Ecosystem")).toBeTruthy();
		expect(getByText("Utility")).toBeTruthy();
		expect(getByText("github.com")).toBeTruthy();
		expect(getByText("4.6")).toBeTruthy();
		expect(getByText("v.1.3.8")).toBeTruthy();
		expect(getByText("4.2 Mb")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
