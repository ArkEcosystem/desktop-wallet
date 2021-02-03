import React from "react";
import { render, screen } from "utils/testing-library";

import { PluginHeader } from "./PluginHeader";

describe("PluginHeader", () => {
	it("should render properly", () => {
		const { container } = render(
			<PluginHeader
				title="Test Plugin"
				author="ARK Ecosystem"
				category="Utility"
				url="https://github.com/arkecosystem"
				version="1.3.8"
				size="4.2 Mb"
			/>,
		);

		expect(screen.getByTestId("PluginHeader__button--install")).toBeInTheDocument();
		expect(screen.getByText("Test Plugin")).toBeInTheDocument();
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
				hasLaunch
			/>,
		);

		expect(screen.getByTestId("PluginCard__logo")).toBeInTheDocument();
		expect(screen.getByTestId("PluginHeader__button--launch")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});
