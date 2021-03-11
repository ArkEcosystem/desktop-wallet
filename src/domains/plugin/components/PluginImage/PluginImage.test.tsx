import React from "react";
import * as utils from "utils/electron-utils";
import { render, screen } from "utils/testing-library";

import { PluginImage } from "./PluginImage";

describe("PluginImage", () => {
	it("should render image placeholder", () => {
		const { container } = render(<PluginImage />);
		expect(screen.getByTestId("PluginImage__placeholder")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it("should render image logo", () => {
		const { container } = render(<PluginImage logoURL="https://ark.io/logo.png" />);
		expect(screen.getByTestId("PluginImage__logo")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it.each(["dark", "light"])("should render updating element in %s mode", (theme) => {
		const utilsSpy = jest.spyOn(utils, "shouldUseDarkColors").mockImplementation(() => theme === "dark");

		const { container } = render(<PluginImage updatingProgress={25} isUpdating />);
		expect(screen.getByTestId("PluginImage__updating")).toBeInTheDocument();
		expect(container).toMatchSnapshot();

		utilsSpy.mockRestore();
	});

	it("should render updating with label", () => {
		const { container } = render(<PluginImage updatingProgress={25} isUpdating showUpdatingLabel />);
		expect(screen.getByTestId("PluginImage__updating__label")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it.each(["xs", "sm", "md", "lg"])("should render with size '%s'", (size) => {
		const { container } = render(<PluginImage />);
		expect(screen.getByTestId("PluginImage__placeholder")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});
