import { render } from "@testing-library/react";
import React from "react";

import { PluginSpecs } from "./PluginSpecs";

describe("PluginSpecs", () => {
	it("should render properly", async () => {
		const { asFragment, findByText } = render(
			<PluginSpecs
				author="ARK Ecosystem"
				category="Utility"
				url="github.com"
				rating="4.6"
				version="1.3.8"
				size="4.2"
			/>,
		);

		expect(await findByText("ARK Ecosystem")).toBeTruthy();
		expect(await findByText("Utility")).toBeTruthy();
		expect(await findByText("github.com")).toBeTruthy();
		expect(await findByText("4.6")).toBeTruthy();
		expect(await findByText("v.1.3.8")).toBeTruthy();
		expect(await findByText("4.2 Mb")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
