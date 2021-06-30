import { translations as commonTranslations } from "app/i18n/common/i18n";
import React from "react";
import { fireEvent, render } from "testing-library";

import { PluginListItem } from "./PluginListItem";

describe("PluginListItem", () => {
	it("should render", () => {
		const plugin = {
			author: "ARK.io",
			category: "utility",
			id: "ark-explorer",
			isInstalled: false,
			size: "4.2 MB",
			title: "ARK Explorer",
			version: "1.3.8",
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
			author: "ARK.io",
			category: "utility",
			id: "ark-explorer",
			isInstalled: false,
			size: "4.2 MB",
			title: "ARK Explorer",
			version: "1.3.8",
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

	it("should trigger update", () => {
		const plugin = {
			author: "ARK.io",
			category: "utility",
			hasUpdateAvailable: true,
			id: "ark-explorer",
			isInstalled: true,
			size: "4.2 MB",
			title: "ARK Explorer",
			version: "1.3.8",
		};

		const onUpdate = jest.fn();

		const { getByTestId, getByText } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} onUpdate={onUpdate} />
				</tbody>
			</table>,
		);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(getByText(commonTranslations.UPDATE));

		expect(getByTestId("PluginListItem__update-badge")).toBeInTheDocument();

		expect(onUpdate).toHaveBeenCalledTimes(1);
	});

	it("should trigger delete", () => {
		const plugin = {
			author: "ARK.io",
			category: "utility",
			id: "ark-explorer",
			isInstalled: true,
			size: "4.2 MB",
			title: "ARK Explorer",
			version: "1.3.8",
		};

		const onDelete = jest.fn();

		const { getByTestId, getByText } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} onDelete={onDelete} />
				</tbody>
			</table>,
		);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(getByText(commonTranslations.DELETE));

		expect(onDelete).toHaveBeenCalledTimes(1);
	});

	it("should trigger enable", () => {
		const plugin = {
			author: "ARK.io",
			category: "utility",
			id: "ark-explorer",
			isInstalled: true,
			size: "4.2 MB",
			title: "ARK Explorer",
			version: "1.3.8",
		};

		const onEnable = jest.fn();

		const { getByTestId, getByText } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} onEnable={onEnable} />
				</tbody>
			</table>,
		);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(getByText(commonTranslations.ENABLE));

		expect(onEnable).toHaveBeenCalledTimes(1);
	});

	it("should trigger click", () => {
		const plugin = {
			author: "ARK.io",
			category: "utility",
			id: "ark-explorer",
			size: "4.2 MB",
			title: "ARK Explorer",
			version: "1.3.8",
		};

		const onClick = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} onClick={onClick} />
				</tbody>
			</table>,
		);

		fireEvent.click(getByTestId("PluginListItem__link"));

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("should trigger disable", () => {
		const plugin = {
			author: "ARK.io",
			category: "utility",
			id: "ark-explorer",
			isEnabled: true,
			isInstalled: true,
			size: "4.2 MB",
			title: "ARK Explorer",
			version: "1.3.8",
		};

		const onDisable = jest.fn();

		const { getByTestId, getByText } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} onDisable={onDisable} />
				</tbody>
			</table>,
		);

		fireEvent.click(getByTestId("dropdown__toggle"));
		fireEvent.click(getByText(commonTranslations.DISABLE));

		expect(onDisable).toHaveBeenCalledTimes(1);
	});

	it("should render launch button", () => {
		const plugin = {
			author: "ARK.io",
			category: "utility",
			hasLaunch: true,
			id: "ark-explorer",
			isEnabled: true,
			isInstalled: true,
			size: "4.2 MB",
			title: "ARK Explorer",
			version: "1.3.8",
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

	it("should render minimum version warning", () => {
		const plugin = {
			category: "utility",
			hasUpdateAvailable: true,
			id: "ark-explorer",
			isCompatible: false,
			isInstalled: true,
			name: "ARK Explorer",
			size: "4.2 MB",
			title: "ARK.io",
			version: "1.3.8",
		};

		const { getByTestId } = render(
			<table>
				<tbody>
					<PluginListItem plugin={plugin} />
				</tbody>
			</table>,
		);

		expect(getByTestId("PluginListItem__minimum-version-warning")).toBeInTheDocument();
	});

	it("should render official icon", () => {
		const plugin = {
			author: "ARK.io",
			category: "utility",
			id: "ark-explorer",
			isInstalled: false,
			isOfficial: true,
			size: "4.2 MB",
			title: "ARK Explorer",
			version: "1.3.8",
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
			author: "ARK.io",
			category: "utility",
			id: "ark-explorer",
			isGrant: true,
			isInstalled: false,
			size: "4.2 MB",
			title: "ARK Explorer",
			version: "1.3.8",
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
