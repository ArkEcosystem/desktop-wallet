import React from "react";
import { render } from "testing-library";

import { PluginSpecs } from "./PluginSpecs";

describe("PluginSpecs", () => {
	it("should render properly", async () => {
		const { asFragment, findByText } = render(
			<PluginSpecs
				author="ARK Ecosystem"
				category="Utility"
				url="https://github.com/arkecosystem/explorer"
				version="1.3.8"
				size="4.2 Mb"
			/>,
		);

		expect(await findByText("ARK Ecosystem")).toBeTruthy();
		expect(await findByText("Utility")).toBeTruthy();
		expect(await findByText("github.com")).toBeTruthy();
		expect(await findByText("1.3.8")).toBeTruthy();
		expect(await findByText("4.2 Mb")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without url and size", async () => {
		const { asFragment, findByText, findByTestId } = render(
			<PluginSpecs author="ARK Ecosystem" category="Utility" version="1.3.8" isOfficial />,
		);

		expect(await findByText("ARK Ecosystem")).toBeTruthy();
		expect(await findByText("Utility")).toBeTruthy();
		expect(await findByTestId("PluginSpecs__url")).toHaveTextContent("N/A");
		expect(await findByTestId("PluginSpecs__size")).toHaveTextContent("N/A");
		expect(asFragment()).toMatchSnapshot();
	});
});
