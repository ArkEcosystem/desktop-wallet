import React from "react";
import { fireEvent, render } from "testing-library";

import { PluginListItem } from "./PluginListItem";

describe("PluginListItem", () => {
	it("should render", () => {
		const plugin = {
			id: "ark-explorer",
			title: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: false,
		};

		const { asFragment, getByTestId } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} />
				</tbody>
			</table>,
		);

		expect(getByTestId("TableRow")).toHaveTextContent("ARK Explorer");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger install", () => {
		const plugin = {
			id: "ark-explorer",
			title: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: false,
		};

		const onInstall = jest.fn();

		const { asFragment, getByTestId } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} onInstall={onInstall} />
				</tbody>
			</table>,
		);

		fireEvent.click(getByTestId("PluginListItem__install"));

		expect(onInstall).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger delete", () => {
		const plugin = {
			id: "ark-explorer",
			title: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: true,
		};

		const onDelete = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} onDelete={onDelete} />
				</tbody>
			</table>,
		);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(getByTestId("dropdown__option--0"));

		expect(onDelete).toHaveBeenCalledTimes(1);
	});

	it("should trigger enable", () => {
		const plugin = {
			id: "ark-explorer",
			title: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: true,
		};

		const onEnable = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} onEnable={onEnable} />
				</tbody>
			</table>,
		);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(getByTestId("dropdown__option--1"));

		expect(onEnable).toHaveBeenCalledTimes(1);
	});

	it("should trigger disable", () => {
		const plugin = {
			id: "ark-explorer",
			title: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: true,
			isEnabled: true,
		};

		const onDisable = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} onDisable={onDisable} />
				</tbody>
			</table>,
		);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(getByTestId("dropdown__option--1"));

		expect(onDisable).toHaveBeenCalledTimes(1);
	});

	it("should render launch button", () => {
		const plugin = {
			id: "ark-explorer",
			title: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: true,
			isEnabled: true,
			hasLaunch: true,
		};

		const onLaunch = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} onLaunch={onLaunch} />
				</tbody>
			</table>,
		);

		fireEvent.click(getByTestId("PluginListItem__launch"));

		expect(onLaunch).toHaveBeenCalledTimes(1);
	});

	it("should render custom logo", () => {
		const plugin = {
			id: "ark-explorer",
			name: "ARK Explorer",
			title: "ARK.io",
			category: "utility",
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: true,
			isEnabled: true,
			logo: "https://ark.io/logo",
		};

		const onLaunch = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} onLaunch={onLaunch} />
				</tbody>
			</table>,
		);

		expect(getByTestId("PluginListItem__logo")).toBeInTheDocument();
	});

	it("should render official icon", () => {
		const plugin = {
			id: "ark-explorer",
			title: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: false,
			isOfficial: true,
		};

		const { asFragment, getByText } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} />
				</tbody>
			</table>,
		);

		expect(getByText("official-ark-plugin.svg")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render grant icon", () => {
		const plugin = {
			id: "ark-explorer",
			title: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: false,
			isGrant: true,
		};

		const { asFragment, getByText } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} />
				</tbody>
			</table>,
		);

		expect(getByText("grant.svg")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});
});
