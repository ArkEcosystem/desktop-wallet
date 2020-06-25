import { fireEvent, render, within } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { PluginList } from "./PluginList";

describe("PluginList", () => {
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
				<PluginList plugins={plugins} />
			</I18nextProvider>,
		);

		expect(getByTestId("PluginListItem--ark-explorer")).toHaveTextContent("ARK Explorer");
		expect(getByTestId("PluginListItem--ark-avatars")).toHaveTextContent("ARK Avatars");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger install", () => {
		const onInstall = jest.fn();

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<PluginList plugins={plugins} onInstall={onInstall} />
			</I18nextProvider>,
		);

		fireEvent.click(within(getByTestId("PluginListItem--ark-explorer")).getByRole("button"));

		expect(onInstall).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger delete", () => {
		const onDelete = jest.fn();

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<PluginList plugins={plugins} onDelete={onDelete} />
			</I18nextProvider>,
		);

		fireEvent.click(within(getByTestId("PluginListItem--ark-avatars")).getByTestId("dropdown__toggle"));
		fireEvent.click(within(getByTestId("PluginListItem--ark-avatars")).getByTestId("dropdown__option--1"));

		expect(onDelete).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});
});
