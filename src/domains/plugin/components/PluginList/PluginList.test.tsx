import { translations as commonTranslations } from "app/i18n/common/i18n";
import React from "react";
import { fireEvent, render, within } from "testing-library";

import { PluginList } from "./PluginList";

const plugins = [
	{
		author: "ARK.io",
		category: "utility",
		id: "ark-explorer",
		isInstalled: false,
		isOfficial: true,
		rating: 4.2,
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
		rating: 3.8,
		size: "163 KB",
		title: "ARK Avatars",
		version: "1.3.8",
	},
];

describe("PluginList", () => {
	it("should render pagination", () => {
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
		const { asFragment, getAllByTestId, getByTestId } = render(
			<PluginList itemsPerPage={4} plugins={[...plugins, ...morePlugins]} />,
		);

		expect(getAllByTestId("TableRow")).toHaveLength(4);
		expect(getByTestId("Pagination")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render pagination", () => {
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
