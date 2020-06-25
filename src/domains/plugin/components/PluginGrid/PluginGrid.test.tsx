import { fireEvent, render, within } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

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
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<PluginGrid plugins={plugins} />
			</I18nextProvider>,
		);

		expect(getByTestId("PluginCard--ark-explorer")).toHaveTextContent("ARK Explorer");
		expect(getByTestId("PluginCard--ark-avatars")).toHaveTextContent("ARK Avatars");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger select", () => {
		const onSelect = jest.fn();

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<PluginGrid plugins={plugins} onSelect={onSelect} />
			</I18nextProvider>,
		);

		fireEvent.click(getByTestId("PluginCard--ark-explorer"));

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger delete", () => {
		const onDelete = jest.fn();
		const onSelect = jest.fn();

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<PluginGrid plugins={plugins} onSelect={onSelect} onDelete={onDelete} />
			</I18nextProvider>,
		);

		fireEvent.click(within(getByTestId("PluginCard--ark-avatars")).getByTestId("dropdown__toggle"));
		fireEvent.click(within(getByTestId("PluginCard--ark-avatars")).getByTestId("dropdown__option--1"));

		expect(onDelete).toHaveBeenCalledTimes(1);
		expect(onSelect).not.toHaveBeenCalled();
		expect(asFragment()).toMatchSnapshot();
	});
});
