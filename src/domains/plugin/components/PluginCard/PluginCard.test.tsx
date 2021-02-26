import { translations as commonTranslations } from "app/i18n/common/i18n";
import React from "react";
import { fireEvent, render } from "testing-library";

import { PluginCard } from "./PluginCard";

const basePlugin = {
	id: "ark-explorer",
	title: "ARK Explorer",
	author: "ARK.io",
	category: "utility",
	version: "1.3.8",
	size: "4.2 MB",
};

describe("PluginCard", () => {
	it("should render", async () => {
		const plugin = {
			...basePlugin,
			isInstalled: false,
		};

		const { asFragment, findByText } = render(<PluginCard plugin={plugin} />);

		expect(await findByText(plugin.title)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger view", () => {
		const plugin = {
			...basePlugin,
			isInstalled: true,
		};

		const onClick = jest.fn();

		const { asFragment, getByTestId } = render(<PluginCard plugin={plugin} onClick={onClick} />);

		fireEvent.click(getByTestId("Card"));

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger update", async () => {
		const plugin = {
			...basePlugin,
			isInstalled: true,
			hasUpdateAvailable: true,
		};

		const onUpdate = jest.fn();

		const { findByText, getByTestId } = render(<PluginCard plugin={plugin} onUpdate={onUpdate} />);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(await findByText(commonTranslations.UPDATE));

		expect(onUpdate).toHaveBeenCalledTimes(1);
	});

	it("should trigger delete", async () => {
		const plugin = {
			...basePlugin,
			isInstalled: true,
		};

		const onDelete = jest.fn();

		const { findByText, getByTestId } = render(<PluginCard plugin={plugin} onDelete={onDelete} />);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(await findByText(commonTranslations.DELETE));

		expect(onDelete).toHaveBeenCalledTimes(1);
	});

	it("should trigger enable", async () => {
		const plugin = {
			...basePlugin,
			isInstalled: true,
		};

		const onEnable = jest.fn();

		const { findByText, getByTestId } = render(<PluginCard plugin={plugin} onEnable={onEnable} />);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(await findByText(commonTranslations.ENABLE));

		expect(onEnable).toHaveBeenCalledTimes(1);
	});

	it("should trigger disable", async () => {
		const plugin = {
			...basePlugin,
			isInstalled: true,
			isEnabled: true,
		};

		const onDisable = jest.fn();

		const { findByText, getByTestId } = render(<PluginCard plugin={plugin} onDisable={onDisable} />);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(await findByText(commonTranslations.DISABLE));

		expect(onDisable).toHaveBeenCalledTimes(1);
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
			isInstalled: false,
			isGrant: true,
		};

		const { asFragment, container } = render(<PluginCard plugin={plugin} />);

		expect(container).toHaveTextContent("grant.svg");
		expect(asFragment()).toMatchSnapshot();
	});
});
