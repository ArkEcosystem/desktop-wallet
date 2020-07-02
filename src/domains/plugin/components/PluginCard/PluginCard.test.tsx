import React from "react";
import { fireEvent, render } from "testing-library";

import { PluginCard } from "./PluginCard";

describe("PluginCard", () => {
	it("should render", () => {
		const plugin = {
			id: "ark-explorer",
			name: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			rating: 4.2,
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: false,
		};

		const { asFragment, getByTestId } = render(<PluginCard plugin={plugin} />);

		expect(getByTestId("PluginCard--ark-explorer")).toHaveTextContent("ARK Explorer");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger delete", () => {
		const plugin = {
			id: "ark-explorer",
			name: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			rating: 4.2,
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: true,
		};

		const onDelete = jest.fn();

		const { asFragment, getByTestId } = render(<PluginCard plugin={plugin} onDelete={onDelete} />);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(getByTestId("dropdown__option--0"));

		expect(onDelete).toHaveBeenCalledTimes(0);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(getByTestId("dropdown__option--1"));

		expect(onDelete).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render official icon", () => {
		const plugin = {
			id: "ark-explorer",
			name: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			rating: 4.2,
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: false,
			isOfficial: true,
		};

		const { asFragment, getByTestId } = render(<PluginCard plugin={plugin} />);

		expect(getByTestId("PluginCard--ark-explorer")).toHaveTextContent("official-ark-plugin.svg");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render grant icon", () => {
		const plugin = {
			id: "ark-explorer",
			name: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			rating: 4.2,
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: false,
			isGrant: true,
		};

		const { asFragment, getByTestId } = render(<PluginCard plugin={plugin} />);

		expect(getByTestId("PluginCard--ark-explorer")).toHaveTextContent("grant.svg");
		expect(asFragment()).toMatchSnapshot();
	});
});
