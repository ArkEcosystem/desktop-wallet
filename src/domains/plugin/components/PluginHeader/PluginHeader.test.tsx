import React from "react";
import { fireEvent, render, screen } from "utils/testing-library";

import { PluginHeader } from "./PluginHeader";

describe("PluginHeader", () => {
	it("should render properly", () => {
		const onInstall = jest.fn();
		const { container } = render(
			<PluginHeader
				title="Test Plugin"
				author="ARK Ecosystem"
				category="Utility"
				url="https://github.com/arkecosystem"
				version="1.3.8"
				size="4.2 Mb"
				onInstall={onInstall}
			/>,
		);

		expect(screen.getByTestId("PluginHeader__button--install")).toBeInTheDocument();
		expect(screen.getByText("Test Plugin")).toBeInTheDocument();

		fireEvent.click(screen.getByTestId("PluginHeader__button--install"));

		expect(onInstall).toHaveBeenCalled();
		expect(container).toMatchSnapshot();
	});

	it("should render with logo", () => {
		const { container } = render(
			<PluginHeader
				title="Test Plugin"
				author="ARK Ecosystem"
				category="Utility"
				url="https://github.com/arkecosystem"
				logo="https://ark.io/logo.png"
				version="1.3.8"
				size="4.2 Mb"
				isInstalled
			/>,
		);

		expect(screen.getByTestId("PluginCard__logo")).toBeInTheDocument();
		expect(screen.getByTestId("PluginHeader__button--open")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});
