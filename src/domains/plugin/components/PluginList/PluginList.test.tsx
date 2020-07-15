import React from "react";
import { fireEvent, render, within } from "testing-library";

import { PluginList } from "./PluginList";

const plugins = [
	{
		id: "ark-explorer",
		name: "ARK Explorer",
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
		name: "ARK Avatars",
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
	it("should render", () => {
		const { asFragment, getByTestId } = render(<PluginList plugins={plugins} />);

		expect(getByTestId("PluginListItem--ark-explorer")).toHaveTextContent("ARK Explorer");
		expect(getByTestId("PluginListItem--ark-avatars")).toHaveTextContent("ARK Avatars");
		expect(getByTestId("Pagination")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without pagination", () => {
		const { asFragment, getByTestId } = render(<PluginList plugins={plugins} withPagination={false} />);

		expect(getByTestId("PluginListItem--ark-explorer")).toHaveTextContent("ARK Explorer");
		expect(getByTestId("PluginListItem--ark-avatars")).toHaveTextContent("ARK Avatars");
		expect(() => getByTestId("Pagination")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should split by page", () => {
		const { asFragment, getByTestId } = render(<PluginList plugins={plugins} itemsPerPage={1} />);

		expect(getByTestId("PluginListItem--ark-explorer")).toHaveTextContent("ARK Explorer");
		expect(() => getByTestId("PluginListItem--ark-avatars")).toThrow(/Unable to find an element by/);

		fireEvent.click(getByTestId("Pagination__next"));

		expect(() => getByTestId("PluginListItem--ark-explorer")).toThrow(/Unable to find an element by/);
		expect(getByTestId("PluginListItem--ark-avatars")).toHaveTextContent("ARK Avatars");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger install", () => {
		const onInstall = jest.fn();

		const { asFragment, getByTestId } = render(<PluginList plugins={plugins} onInstall={onInstall} />);

		fireEvent.click(within(getByTestId("PluginListItem--ark-explorer")).getByRole("button"));

		expect(onInstall).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger delete", () => {
		const onDelete = jest.fn();

		const { asFragment, getByTestId } = render(<PluginList plugins={plugins} onDelete={onDelete} />);

		fireEvent.click(within(getByTestId("PluginListItem--ark-avatars")).getByTestId("dropdown__toggle"));
		fireEvent.click(within(getByTestId("PluginListItem--ark-avatars")).getByTestId("dropdown__option--1"));

		expect(onDelete).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});
});
