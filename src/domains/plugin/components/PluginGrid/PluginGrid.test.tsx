import React from "react";
import { fireEvent, render, within } from "testing-library";

import { PluginGrid } from "./PluginGrid";

describe("PluginGrid", () => {
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

	it("should render", () => {
		const { asFragment, getByTestId } = render(<PluginGrid plugins={plugins} />);

		expect(getByTestId("PluginCard--ark-explorer")).toHaveTextContent("ARK Explorer");
		expect(getByTestId("PluginCard--ark-avatars")).toHaveTextContent("ARK Avatars");
		expect(getByTestId("Pagination")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without pagination", () => {
		const { asFragment, getByTestId } = render(<PluginGrid plugins={plugins} withPagination={false} />);

		expect(getByTestId("PluginCard--ark-explorer")).toHaveTextContent("ARK Explorer");
		expect(getByTestId("PluginCard--ark-avatars")).toHaveTextContent("ARK Avatars");
		expect(() => getByTestId("Pagination")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should split by page", () => {
		const { asFragment, getByTestId } = render(<PluginGrid plugins={plugins} itemsPerPage={1} />);

		expect(getByTestId("PluginCard--ark-explorer")).toHaveTextContent("ARK Explorer");
		expect(() => getByTestId("PluginCard--ark-avatars")).toThrow(/Unable to find an element by/);

		fireEvent.click(getByTestId("Pagination__next"));

		expect(() => getByTestId("PluginCard--ark-explorer")).toThrow(/Unable to find an element by/);
		expect(getByTestId("PluginCard--ark-avatars")).toHaveTextContent("ARK Avatars");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger select", () => {
		const onSelect = jest.fn();

		const { asFragment, getByTestId } = render(<PluginGrid plugins={plugins} onSelect={onSelect} />);

		fireEvent.click(getByTestId("PluginCard--ark-explorer"));

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger delete", () => {
		const onDelete = jest.fn();
		const onSelect = jest.fn();

		const { asFragment, getByTestId } = render(
			<PluginGrid plugins={plugins} onSelect={onSelect} onDelete={onDelete} />,
		);

		fireEvent.click(within(getByTestId("PluginCard--ark-avatars")).getByTestId("dropdown__toggle"));
		fireEvent.click(within(getByTestId("PluginCard--ark-avatars")).getByTestId("dropdown__option--1"));

		expect(onDelete).toHaveBeenCalledTimes(1);
		expect(onSelect).not.toHaveBeenCalled();
		expect(asFragment()).toMatchSnapshot();
	});
});
