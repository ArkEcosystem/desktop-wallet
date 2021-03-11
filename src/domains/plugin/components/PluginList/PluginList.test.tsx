import { translations as commonTranslations } from "app/i18n/common/i18n";
import React from "react";
import { fireEvent, render, within } from "testing-library";

import { PluginList } from "./PluginList";

const plugins = [
	{
		id: "ark-explorer",
		title: "ARK Explorer",
		author: "ARK.io",
		category: "utility",
		rating: 4.2,
		version: "1.3.8",
		size: "4.2 MB",
		isInstalled: false,
		isOfficial: true,
	},
	{
		id: "ark-avatars",
		title: "ARK Avatars",
		author: "ARK.io",
		category: "other",
		rating: 3.8,
		version: "1.3.8",
		size: "163 KB",
		isInstalled: true,
		isGrant: true,
	},
];

describe("PluginList", () => {
	it("should render pagination", () => {
		const morePlugins = [
			{
				id: "drakula-theme",
				title: "Drakula Theme",
				author: "Breno Polanski",
				category: "other",
				version: "1.3.8",
				size: "163 KB",
				isInstalled: true,
				isEnabled: true,
				isGrant: true,
			},
			{
				id: "avfc-theme",
				title: "Avfc Theme",
				author: "ARK.io",
				category: "other",
				version: "1.3.8",
				size: "163 KB",
				isInstalled: true,
				isEnabled: true,
				isGrant: true,
			},
			{
				id: "red-snow-theme",
				title: "Red snow theme",
				author: "ARK.io",
				category: "other",
				version: "1.3.8",
				size: "163 KB",
				isInstalled: true,
				isEnabled: true,
				isGrant: true,
			},
		];
		const { asFragment, getAllByTestId, getByTestId } = render(
			<PluginList itemsPerPage={4} plugins={[...plugins, ...morePlugins]} />,
		);

		expect(getAllByTestId("TableRow")).toHaveLength(4);
		expect(getByTestId("Pagination")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("shouldn't render pagination", () => {
		const { asFragment, getAllByTestId, getByTestId } = render(<PluginList plugins={plugins} />);

		expect(getAllByTestId("TableRow")).toHaveLength(2);
		expect(() => getByTestId("Pagination")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without pagination", () => {
		const { asFragment, getAllByTestId, getByTestId } = render(
			<PluginList plugins={plugins} showPagination={false} />,
		);

		expect(getAllByTestId("TableRow")).toHaveLength(2);
		expect(() => getByTestId("Pagination")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should split by page", () => {
		const { asFragment, getAllByTestId, getByTestId, getByText } = render(
			<PluginList plugins={plugins} itemsPerPage={1} />,
		);

		expect(getAllByTestId("TableRow")).toHaveLength(1);

		expect(getByText("ARK Explorer")).toBeTruthy();
		expect(() => getByText("ARK Avatars")).toThrow(/Unable to find an element with/);

		fireEvent.click(getByTestId("Pagination__next"));

		expect(getByText("ARK Avatars")).toBeTruthy();
		expect(() => getByText("ARK Explorer")).toThrow(/Unable to find an element with/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger install", () => {
		const onInstall = jest.fn();

		const { asFragment, getAllByTestId } = render(<PluginList plugins={plugins} onInstall={onInstall} />);

		fireEvent.click(within(getAllByTestId("TableRow")[1]).getByTestId("PluginListItem__install"));

		expect(onInstall).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger delete", () => {
		const onDelete = jest.fn();

		const { asFragment, getAllByTestId } = render(<PluginList plugins={plugins} onDelete={onDelete} />);

		fireEvent.click(within(getAllByTestId("TableRow")[0]).getByTestId("dropdown__toggle"));
		fireEvent.click(within(getAllByTestId("TableRow")[0]).getByText(commonTranslations.DELETE));

		expect(onDelete).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});
});
