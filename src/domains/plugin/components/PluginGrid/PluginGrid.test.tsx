import React from "react";
import { fireEvent, render, within } from "testing-library";

import { PluginGrid } from "./PluginGrid";

const plugins = [
	{
		id: "ark-explorer",
		name: "ARK Explorer",
		author: "ARK.io",
		category: "utility",
		version: "1.3.8",
		size: "4.2 MB",
		isInstalled: false,
		isOfficial: true,
	},
	{
		id: "ark-avatars",
		name: "ARK Avatars",
		author: "ARK.io",
		category: "other",
		version: "1.3.8",
		size: "163 KB",
		isInstalled: true,
		isGrant: true,
	},
	{
		id: "ark-theme",
		name: "ARK Theme",
		author: "ARK.io",
		category: "other",
		version: "1.3.8",
		size: "163 KB",
		isInstalled: true,
		isEnabled: true,
		isGrant: true,
	},
];

describe("PluginGrid", () => {
	it("should render", async () => {
		const { asFragment, findByText, getByTestId } = render(<PluginGrid plugins={plugins} />);

		for (const plugin of plugins) {
			expect(await findByText(plugin.name)).toBeTruthy();
		}

		expect(getByTestId("Pagination")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without pagination", async () => {
		const { asFragment, findByText, getByTestId } = render(<PluginGrid plugins={plugins} withPagination={false} />);

		for (const plugin of plugins) {
			expect(await findByText(plugin.name)).toBeTruthy();
		}

		expect(() => getByTestId("Pagination")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should split by page", async () => {
		const { asFragment, findByText, getByTestId } = render(<PluginGrid plugins={plugins} itemsPerPage={1} />);

		expect(await findByText(plugins[0].name)).toBeTruthy();
		await expect(findByText(plugins[1].name)).rejects.toThrow();

		fireEvent.click(getByTestId("Pagination__next"));

		expect(await findByText(plugins[1].name)).toBeTruthy();
		await expect(findByText(plugins[0].name)).rejects.toThrow();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger select", async () => {
		const onSelect = jest.fn();

		const { findByText } = render(<PluginGrid plugins={plugins} onSelect={onSelect} />);

		fireEvent.click(await findByText(plugins[0].name));

		expect(onSelect).toHaveBeenCalledTimes(1);
	});

	it("should trigger delete", async () => {
		const onDelete = jest.fn();

		const { findByText } = render(<PluginGrid plugins={plugins} onSelect={jest.fn()} onDelete={onDelete} />);

		const card = (await findByText(plugins[1].name)).parentNode.parentNode.parentNode;

		fireEvent.click(within(card).getByTestId("dropdown__toggle"));
		fireEvent.click(within(card).getByTestId("dropdown__option--0"));

		expect(onDelete).toHaveBeenCalledTimes(1);
	});

	it("should trigger enable", async () => {
		const onEnable = jest.fn();

		const { findByText } = render(<PluginGrid plugins={plugins} onSelect={jest.fn()} onEnable={onEnable} />);

		const card = (await findByText(plugins[1].name)).parentNode.parentNode.parentNode;

		fireEvent.click(within(card).getByTestId("dropdown__toggle"));
		fireEvent.click(within(card).getByTestId("dropdown__option--1"));

		expect(onEnable).toHaveBeenCalledTimes(1);
	});

	it("should trigger disable", async () => {
		const onDisable = jest.fn();

		const { findByText } = render(<PluginGrid plugins={plugins} onSelect={jest.fn()} onDisable={onDisable} />);

		const card = (await findByText(plugins[2].name)).parentNode.parentNode.parentNode;

		fireEvent.click(within(card).getByTestId("dropdown__toggle"));
		fireEvent.click(within(card).getByTestId("dropdown__option--1"));

		expect(onDisable).toHaveBeenCalledTimes(1);
	});
});
