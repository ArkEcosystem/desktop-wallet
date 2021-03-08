import { fireEvent } from "@testing-library/react";
import { ipcRenderer } from "electron";
import React from "react";
import { render } from "testing-library";

import { PluginSpecs } from "./PluginSpecs";

describe("PluginSpecs", () => {
	it("should render properly", async () => {
		const ipcRendererMock = jest.spyOn(ipcRenderer, "send").mockImplementation();

		const { asFragment, findByText, getByTestId } = render(
			<PluginSpecs
				author="ARK Ecosystem"
				category="Utility"
				url="https://github.com/arkecosystem/explorer"
				version="1.3.8"
				size="4.2 Mb"
			/>,
		);

		fireEvent.click(getByTestId("PluginSpecs__url"));
		expect(ipcRendererMock).toHaveBeenLastCalledWith("open-external", "https://github.com/arkecosystem/explorer");

		expect(await findByText("ARK Ecosystem")).toBeTruthy();
		expect(await findByText("Utility")).toBeTruthy();
		expect(await findByText("github.com")).toBeTruthy();
		expect(await findByText("1.3.8")).toBeTruthy();
		expect(await findByText("4.2 Mb")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		ipcRendererMock.mockRestore();
	});

	it("should render without url and size", async () => {
		const { asFragment, findAllByText, findByText } = render(
			<PluginSpecs author="ARK Ecosystem" category="Utility" version="1.3.8" isOfficial />,
		);

		expect(await findByText("ARK Ecosystem")).toBeTruthy();
		expect(await findByText("Utility")).toBeTruthy();
		expect(await findAllByText("N/A")).toHaveLength(2);
		expect(asFragment()).toMatchSnapshot();
	});
});
