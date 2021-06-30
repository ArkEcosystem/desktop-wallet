import * as useRandomNumberHook from "app/hooks/use-random-number";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { translations as pluginTranslations } from "domains/plugin/i18n";
import React from "react";
import { fireEvent, render, screen } from "utils/testing-library";

import { PluginGrid } from "./PluginGrid";

const plugins = [
	{
		author: "ARK.io",
		category: "utility",
		id: "ark-explorer",
		isInstalled: false,
		isOfficial: true,
		size: "4.2 MB",
		title: "ARK Explorer",
		version: "1.3.8",
	},
	{
		author: "ARK.io",
		category: "other",
		id: "ark-avatars",
		isGrant: true,
		isInstalled: true,
		size: "163 KB",
		title: "ARK Avatars",
		version: "1.3.8",
	},
	{
		author: "ARK.io",
		category: "other",
		id: "ark-theme",
		isEnabled: true,
		isGrant: true,
		isInstalled: true,
		size: "163 KB",
		title: "ARK Theme",
		version: "1.3.8",
	},
];

describe("PluginGrid", () => {
	beforeAll(() => {
		jest.spyOn(useRandomNumberHook, "useRandomNumber").mockImplementation(() => 1);
	});

	afterAll(() => {
		useRandomNumberHook.useRandomNumber.mockRestore();
	});

	it("should render pagination", async () => {
		const morePlugins = [
			{
				author: "Breno Polanski",
				category: "other",
				id: "drakula-theme",
				isEnabled: true,
				isGrant: true,
				isInstalled: true,
				size: "163 KB",
				title: "Drakula Theme",
				version: "1.3.8",
			},
			{
				author: "ARK.io",
				category: "other",
				id: "avfc-theme",
				isEnabled: true,
				isGrant: true,
				isInstalled: true,
				size: "163 KB",
				title: "Avfc Theme",
				version: "1.3.8",
			},
			{
				author: "ARK.io",
				category: "other",
				id: "red-snow-theme",
				isEnabled: true,
				isGrant: true,
				isInstalled: true,
				size: "163 KB",
				title: "Red snow theme",
				version: "1.3.8",
			},
		];
		const { asFragment, findByText, getByTestId } = render(
			<PluginGrid itemsPerPage={4} plugins={[...plugins, ...morePlugins]} />,
		);

		for (const plugin of plugins) {
			expect(await findByText(plugin.title)).toBeTruthy();
		}

		expect(getByTestId("Pagination")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without plugins", async () => {
		const { asFragment, findByText, getByTestId } = render(<PluginGrid plugins={[]} />);

		expect(getByTestId("PluginGrid__empty-message")).toBeTruthy();
		expect(await findByText(pluginTranslations.PAGE_PLUGIN_MANAGER.NO_PLUGINS_AVAILABLE)).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render pagination", async () => {
		const { asFragment, findByText, getByTestId } = render(<PluginGrid plugins={plugins} />);

		for (const plugin of plugins) {
			expect(await findByText(plugin.title)).toBeTruthy();
		}

		expect(() => getByTestId("Pagination")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render skeletons", () => {
		const { asFragment, getAllByTestId } = render(<PluginGrid isLoading plugins={[]} />);

		expect(getAllByTestId("PluginCardSkeleton")).toHaveLength(3);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render custom number of skeletons", () => {
		const { asFragment, getAllByTestId } = render(<PluginGrid isLoading skeletonsLimit={3} plugins={[]} />);

		expect(getAllByTestId("PluginCardSkeleton")).toHaveLength(3);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without pagination", async () => {
		const { asFragment, findByText, getByTestId } = render(<PluginGrid plugins={plugins} showPagination={false} />);

		for (const plugin of plugins) {
			expect(await findByText(plugin.title)).toBeTruthy();
		}

		expect(() => getByTestId("Pagination")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should split by page", async () => {
		const { asFragment, findByText, getByTestId } = render(<PluginGrid plugins={plugins} itemsPerPage={1} />);

		expect(await findByText(plugins[0].title)).toBeTruthy();
		await expect(findByText(plugins[1].title)).rejects.toThrow();

		fireEvent.click(getByTestId("Pagination__next"));

		expect(await findByText(plugins[1].title)).toBeTruthy();
		await expect(findByText(plugins[0].title)).rejects.toThrow();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger select", async () => {
		const onSelect = jest.fn();

		const { findByText } = render(<PluginGrid plugins={plugins} onSelect={onSelect} />);

		fireEvent.click(await findByText(plugins[0].title));

		expect(onSelect).toHaveBeenCalledTimes(1);
	});

	it("should trigger update", () => {
		const onUpdate = jest.fn();

		render(
			<PluginGrid
				plugins={[{ ...plugins[0], hasUpdateAvailable: true, isInstalled: true }]}
				onSelect={jest.fn()}
				onUpdate={onUpdate}
			/>,
		);

		fireEvent.click(screen.queryAllByTestId("dropdown__toggle")[0]);
		fireEvent.click(screen.getByText(commonTranslations.UPDATE));

		expect(onUpdate).toHaveBeenCalledTimes(1);
	});

	it("should trigger update by addon button", () => {
		const onUpdate = jest.fn();

		const { container } = render(
			<PluginGrid
				plugins={[{ ...plugins[0], hasUpdateAvailable: true, isInstalled: true }]}
				onSelect={jest.fn()}
				onUpdate={onUpdate}
			/>,
		);

		fireEvent.click(screen.getByTestId("PluginCard__update-available"));

		expect(onUpdate).toHaveBeenCalledTimes(1);

		expect(container).toMatchSnapshot();
	});

	it("should trigger delete", () => {
		const onDelete = jest.fn();

		render(<PluginGrid plugins={plugins} onSelect={jest.fn()} onDelete={onDelete} />);

		fireEvent.click(screen.queryAllByTestId("dropdown__toggle")[1]);
		fireEvent.click(screen.getByText(commonTranslations.DELETE));

		expect(onDelete).toHaveBeenCalledTimes(1);
	});

	it("should trigger enable", () => {
		const onEnable = jest.fn();

		render(<PluginGrid plugins={plugins} onSelect={jest.fn()} onEnable={onEnable} />);

		fireEvent.click(screen.queryAllByTestId("dropdown__toggle")[1]);
		fireEvent.click(screen.getByText(commonTranslations.ENABLE));

		expect(onEnable).toHaveBeenCalledTimes(1);
	});

	it("should trigger disable", () => {
		const onDisable = jest.fn();

		render(<PluginGrid plugins={plugins} onSelect={jest.fn()} onDisable={onDisable} />);

		fireEvent.click(screen.queryAllByTestId("dropdown__toggle")[2]);
		fireEvent.click(screen.getByText(commonTranslations.DISABLE));

		expect(onDisable).toHaveBeenCalledTimes(1);
	});

	it("should trigger install", () => {
		const onInstall = jest.fn();

		render(<PluginGrid plugins={plugins} onSelect={jest.fn()} onInstall={onInstall} />);

		fireEvent.click(screen.queryAllByTestId("dropdown__toggle")[0]);
		fireEvent.click(screen.getByText(commonTranslations.INSTALL));

		expect(onInstall).toHaveBeenCalledTimes(1);
	});

	it("should trigger launch", () => {
		const onLaunch = jest.fn();

		render(
			<PluginGrid
				plugins={[{ ...plugins[0], hasLaunch: true, isInstalled: true }]}
				onSelect={jest.fn()}
				onLaunch={onLaunch}
			/>,
		);

		fireEvent.click(screen.queryAllByTestId("dropdown__toggle")[0]);
		fireEvent.click(screen.getByText(commonTranslations.LAUNCH));

		expect(onLaunch).toHaveBeenCalledTimes(1);
	});
});
