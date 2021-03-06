import { translations as commonTranslations } from "app/i18n/common/i18n";
import { translations as pluginTranslations } from "domains/plugin/i18n";
import React from "react";
import { fireEvent, render, screen } from "utils/testing-library";

import { BlankPluginCard, PluginCard } from "./PluginCard";

const basePlugin = {
	author: "ARK.io",
	category: "utility",
	id: "ark-explorer",
	size: "4.2 MB",
	title: "ARK Explorer",
	version: "1.3.8",
};

describe("PluginCard", () => {
	it("should render", () => {
		const plugin = {
			...basePlugin,
			isInstalled: false,
		};

		const { asFragment } = render(<PluginCard plugin={plugin} />);

		expect(screen.getByText(plugin.title)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without category", () => {
		const plugin = {
			...basePlugin,
			isInstalled: false,
		};

		const { asFragment } = render(<PluginCard plugin={plugin} showCategory={false} />);

		expect(screen.getByText(plugin.title)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger view", () => {
		const plugin = {
			...basePlugin,
			isInstalled: true,
		};

		const onClick = jest.fn();

		const { asFragment } = render(<PluginCard plugin={plugin} onClick={onClick} />);

		fireEvent.click(screen.getByTestId("Card"));

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render official icon", () => {
		const plugin = {
			...basePlugin,
			isInstalled: false,
			isOfficial: true,
		};

		const { asFragment, container } = render(<PluginCard plugin={plugin} />);

		expect(container).toHaveTextContent("official-ark-plugin.svg");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render grant icon", () => {
		const plugin = {
			...basePlugin,
			isGrant: true,
			isInstalled: false,
		};

		const { asFragment, container } = render(<PluginCard plugin={plugin} />);

		expect(container).toHaveTextContent("grant.svg");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render alert icon", () => {
		const plugin = {
			...basePlugin,
			hasUpdateAvailable: true,
			isCompatible: false,
			isInstalled: true,
		};

		const { asFragment, container } = render(<PluginCard plugin={plugin} />);

		expect(container).toHaveTextContent("alert-warning.svg");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render update icon", () => {
		const plugin = {
			...basePlugin,
			hasUpdateAvailable: true,
			isInstalled: true,
		};

		const { asFragment, container } = render(<PluginCard plugin={plugin} />);

		expect(container).toHaveTextContent("update.svg");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should call onSelect callback on update icon click", () => {
		const onSelect = jest.fn();

		const plugin = {
			...basePlugin,
			hasUpdateAvailable: true,
			isInstalled: true,
		};

		render(<PluginCard plugin={plugin} onSelect={onSelect} />);

		fireEvent.click(screen.getByText("update.svg"));

		expect(onSelect).toHaveBeenCalledWith({ value: "update" });
	});

	it.each([
		["space", { key: " ", keyCode: 32 }],
		["enter", { key: "Enter", keyCode: 13 }],
	])("should call onSelect callback on update icon keypress (%s)", (_, key) => {
		const onSelect = jest.fn();

		const plugin = {
			...basePlugin,
			hasUpdateAvailable: true,
			isInstalled: true,
		};

		render(<PluginCard plugin={plugin} onSelect={onSelect} />);

		fireEvent.keyDown(screen.getByText("update.svg"), key);

		expect(onSelect).toHaveBeenCalledWith({ value: "update" });
	});

	it("should not call onSelect callback on update icon keypress", () => {
		const onSelect = jest.fn();

		const plugin = {
			...basePlugin,
			hasUpdateAvailable: true,
			isInstalled: true,
		};

		render(<PluginCard plugin={plugin} onSelect={onSelect} />);

		fireEvent.keyDown(screen.getByText("update.svg"), { key: "Escape", keyCode: 27 });

		expect(onSelect).not.toHaveBeenCalled();
	});
});

describe("BlankPluginCard", () => {
	it("should render", () => {
		const { asFragment } = render(<BlankPluginCard />);

		expect(screen.getByText(commonTranslations.AUTHOR)).toBeTruthy();
		expect(screen.getByText(commonTranslations.NAME)).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with name", () => {
		const { asFragment } = render(<BlankPluginCard name="test-name" />);

		expect(screen.getByText(commonTranslations.AUTHOR)).toBeTruthy();
		expect(screen.getByText("test-name")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with category", () => {
		const { asFragment } = render(<BlankPluginCard category="exchange" />);

		expect(screen.getByText(commonTranslations.AUTHOR)).toBeTruthy();
		expect(screen.getByText(pluginTranslations.CATEGORIES.EXCHANGE)).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});
});
