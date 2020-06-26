import { act, fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import { translations as pluginTranslations } from "domains/plugin/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";

import { Settings } from "./Settings";

describe("Settings", () => {
	it("should render", () => {
		const items = [
			{
				itemKey: "General",
				label: "General",
				icon: "General",
				route: "/settings/general",
			},
			{
				itemKey: "Peer",
				label: "Peer",
				icon: "Peer",
				route: "/settings/peer",
			},
			{
				itemKey: "Plugins",
				label: "Plugins",
				icon: "Plugin",
				route: "/settings/plugins",
			},
		];

		const settingsProps = {
			pageConfig: {
				title: "Wallet Settings",
				subheader: "Customize your wallet to suit your needs.",
			},
		};

		const { container, asFragment } = render(
			<Settings settings={items} activeSettings={"General"} setActiveSettings={() => null} {...settingsProps} />,
			{ wrapper: MemoryRouter },
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render peer settings", () => {
		const items = [
			{
				itemKey: "General",
				label: "General",
				icon: "General",
				route: "/settings/general",
			},
			{
				itemKey: "Peer",
				label: "Peer",
				icon: "Peer",
				route: "/settings/peer",
			},
			{
				itemKey: "Plugins",
				label: "Plugins",
				icon: "Plugin",
				route: "/settings/plugins",
			},
		];

		const settingsProps = {
			pageConfig: {
				title: "Peer Settings",
				subheader: "Customize your wallet to suit your needs.",
			},
		};

		const { container, asFragment } = render(
			<Settings settings={items} activeSettings={"Peer"} setActiveSettings={() => null} {...settingsProps} />,
			{ wrapper: MemoryRouter },
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render plugin settings", () => {
		const items = [
			{
				itemKey: "General",
				label: "General",
				icon: "General",
				route: "/settings/general",
			},
			{
				itemKey: "Peer",
				label: "Peer",
				icon: "Peer",
				route: "/settings/peer",
			},
			{
				itemKey: "Plugins",
				label: "Plugins",
				icon: "Plugin",
				route: "/settings/plugins",
			},
		];

		const settingsProps = {
			pageConfig: {
				title: "Plugin Settings",
				subheader: "Customize your wallet to suit your needs.",
			},
		};

		const { container, asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<Settings
					settings={items}
					activeSettings={"Plugins"}
					setActiveSettings={() => null}
					{...settingsProps}
				/>
			</I18nextProvider>,
			{ wrapper: MemoryRouter },
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open & close modals in the plugin settings", () => {
		const items = [
			{
				itemKey: "General",
				label: "General",
				icon: "General",
				route: "/settings/general",
			},
			{
				itemKey: "Peer",
				label: "Peer",
				icon: "Peer",
				route: "/settings/peer",
			},
			{
				itemKey: "Plugins",
				label: "Plugins",
				icon: "Plugin",
				route: "/settings/plugins",
			},
		];

		const settingsProps = {
			pageConfig: {
				title: "Plugin Settings",
				subheader: "Customize your wallet to suit your needs.",
			},
		};

		const { container, asFragment, getByTestId, queryByText } = render(
			<I18nextProvider i18n={i18n}>
				<Settings
					settings={items}
					activeSettings={"Plugins"}
					setActiveSettings={() => null}
					{...settingsProps}
				/>
			</I18nextProvider>,
			{ wrapper: MemoryRouter },
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		// Open `BlacklistPlugins` modal
		act(() => {
			fireEvent.click(getByTestId("plugins__open-list"));
		});
		expect(getByTestId("modal__inner")).toHaveTextContent(pluginTranslations.MODAL_BLACKLIST_PLUGINS.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		// Open `AddBlacklistPlugin` modal
		act(() => {
			fireEvent.click(getByTestId("plugins__add-plugin"));
		});
		expect(getByTestId("modal__inner")).toHaveTextContent(pluginTranslations.MODAL_ADD_BLACKLIST_PLUGIN.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should render a not found information", () => {
		const items = [
			{
				itemKey: "General",
				label: "General",
				icon: "General",
				route: "/settings/general",
			},
			{
				itemKey: "Peer",
				label: "Peer",
				icon: "Peer",
				route: "/settings/peer",
			},
			{
				itemKey: "Plugins",
				label: "Plugins",
				icon: "Plugin",
				route: "/settings/plugins",
			},
			{
				itemKey: "Foo",
				label: "Foo",
				icon: "Foo",
				route: "/settings/foo",
			},
		];

		const settingsProps = {
			pageConfig: {
				title: "Wallet Settings",
				subheader: "Customize your wallet to suit your needs.",
			},
		};

		const { container, asFragment } = render(
			<Settings settings={items} activeSettings={"Foo"} setActiveSettings={() => null} {...settingsProps} />,
			{ wrapper: MemoryRouter },
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
