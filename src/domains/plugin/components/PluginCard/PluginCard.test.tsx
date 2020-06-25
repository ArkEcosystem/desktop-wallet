import { fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

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

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<PluginCard plugin={plugin} />
			</I18nextProvider>,
		);

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

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<PluginCard plugin={plugin} onDelete={onDelete} />
			</I18nextProvider>,
		);

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

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<PluginCard plugin={plugin} />
			</I18nextProvider>,
		);

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

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<PluginCard plugin={plugin} />
			</I18nextProvider>,
		);

		expect(getByTestId("PluginCard--ark-explorer")).toHaveTextContent("grant.svg");
		expect(asFragment()).toMatchSnapshot();
	});
});
