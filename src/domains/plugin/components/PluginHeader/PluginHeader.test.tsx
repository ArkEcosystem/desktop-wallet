import { translations as commonTranslations } from "app/i18n/common/i18n";
import React from "react";
import { fireEvent, render, screen } from "utils/testing-library";

import { PluginHeader } from "./PluginHeader";

describe("PluginHeader", () => {
	const pluginDataFixture = {
		title: "Test Plugin",
		author: "ARK Ecosystem",
		category: "Utility",
		url: "https://github.com/arkecosystem",
		version: "1.3.8",
		size: "4.2 Mb",
	};

	it("should render properly", () => {
		const onInstall = jest.fn();
		const { container } = render(<PluginHeader {...pluginDataFixture} onInstall={onInstall} />);

		expect(screen.getByTestId("PluginHeader__button--install")).toBeInTheDocument();
		expect(screen.getByText("Test Plugin")).toBeInTheDocument();

		fireEvent.click(screen.getByTestId("PluginHeader__button--install"));

		expect(onInstall).toHaveBeenCalled();
		expect(container).toMatchSnapshot();
	});

	it("should render updating plugin", () => {
		const onInstall = jest.fn();
		const { container } = render(<PluginHeader {...pluginDataFixture} updatingStats={{ percent: 0.2 }} />);

		expect(screen.getByTestId("PluginImage__updating")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it("should trigger update", () => {
		const onUpdate = jest.fn();

		const { container } = render(
			<PluginHeader {...pluginDataFixture} isInstalled hasUpdateAvailable onUpdate={onUpdate} />,
		);

		fireEvent.click(screen.getByTestId("PluginHeader__dropdown-toggle"));
		fireEvent.click(screen.getByText(commonTranslations.UPDATE));

		expect(onUpdate).toHaveBeenCalled();
	});

	it("should trigger delete", () => {
		const onDelete = jest.fn();

		const { container } = render(<PluginHeader {...pluginDataFixture} isInstalled onDelete={onDelete} />);

		fireEvent.click(screen.getByTestId("PluginHeader__dropdown-toggle"));
		fireEvent.click(screen.getByText(commonTranslations.DELETE));

		expect(onDelete).toHaveBeenCalled();
	});

	it("should trigger enable", () => {
		const onEnable = jest.fn();

		const { container } = render(<PluginHeader {...pluginDataFixture} isInstalled onEnable={onEnable} />);

		fireEvent.click(screen.getByTestId("PluginHeader__dropdown-toggle"));
		fireEvent.click(screen.getByText(commonTranslations.ENABLE));

		expect(onEnable).toHaveBeenCalled();
	});

	it("should trigger disable", () => {
		const onDisable = jest.fn();

		const { container } = render(
			<PluginHeader {...pluginDataFixture} isInstalled isEnabled onDisable={onDisable} />,
		);

		fireEvent.click(screen.getByTestId("PluginHeader__dropdown-toggle"));
		fireEvent.click(screen.getByText(commonTranslations.DISABLE));

		expect(onDisable).toHaveBeenCalled();
	});
});
