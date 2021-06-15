/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { pluginManager, PluginProviders } from "app/PluginProviders";
import { toasts } from "app/services";
import { ipcRenderer } from "electron";
import { createMemoryHistory } from "history";
import nock from "nock";
import { LaunchPluginService, PluginController, usePluginManagerContext } from "plugins";
import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor, within } from "testing-library";
import { env } from "utils/testing-library";

import { translations } from "../../i18n";
import { PluginManager } from "./PluginManager";

let profile: Contracts.IProfile;
const history = createMemoryHistory();

const fixtureProfileId = getDefaultProfileId();
const pluginsURL = `/profiles/${fixtureProfileId}/plugins`;

const Component = () => {
	const { fetchPluginPackages } = usePluginManagerContext();

	useEffect(() => {
		fetchPluginPackages();
	}, []);

	return <PluginManager />;
};

describe("PluginManager", () => {
	beforeEach(async () => {
		nock("https://registry.npmjs.com")
			.get("/-/v1/search")
			.query((params) => params.from === "0")
			.once()
			.reply(200, require("tests/fixtures/plugins/registry-response.json"))
			.get("/-/v1/search")
			.query((params) => params.from === "250")
			.once()
			.reply(200, {});

		nock("https://raw.github.com")
			.get("/dated/transaction-export-plugin/master/package.json")
			.reply(200, require("tests/fixtures/plugins/github/@dated/transaction-export-plugin/package.json"))
			.get("/dated/delegate-calculator-plugin/master/package.json")
			.reply(200, require("tests/fixtures/plugins/github/@dated/delegate-calculator-plugin/package.json"))
			.get("/ark-ecosystem-desktop-plugins/sound-notifications/master/package.json")
			.reply(
				200,
				require("tests/fixtures/plugins/github/@arkecosystem/desktop-wallet-sound-notifications/package.json"),
			)
			.get("/ark-ecosystem-desktop-plugins/explorer/master/package.json")
			.reply(200, require("tests/fixtures/plugins/github/@arkecosystem/desktop-wallet-explorer/package.json"))
			.persist();

		profile = env.profiles().findById(getDefaultProfileId());
		history.push(pluginsURL);
	});

	it("should render", async () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		expect(screen.getByTestId("header__title")).toHaveTextContent(translations.PAGE_PLUGIN_MANAGER.TITLE);
		expect(screen.getByTestId("header__subtitle")).toHaveTextContent(translations.PAGE_PLUGIN_MANAGER.DESCRIPTION);

		await waitFor(() =>
			expect(
				within(screen.getByTestId("PluginManager__latest__utility")).getAllByText("Transaction Export"),
			).toHaveLength(1),
		);

		await waitFor(() => expect(screen.getAllByTestId("Card")).toHaveLength(12));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle between list and grid on latest", async () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(
				within(screen.getByTestId("PluginManager__latest__utility")).getAllByText("Transaction Export"),
			).toHaveLength(1),
		);

		await waitFor(() => expect(screen.getAllByTestId("Card")).toHaveLength(12));

		expect(within(screen.getByTestId("PluginManager__latest__utility")).getByTestId("PluginGrid")).toBeTruthy();

		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));
		expect(within(screen.getByTestId("PluginManager__latest__utility")).getByTestId("PluginList")).toBeTruthy();

		fireEvent.click(screen.getByTestId("LayoutControls__grid--icon"));
		expect(within(screen.getByTestId("PluginManager__latest__utility")).getByTestId("PluginGrid")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle between list and grid on all", async () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		fireEvent.click(screen.getByTestId("tabs__tab-button-all"));

		await waitFor(() =>
			expect(
				within(screen.getByTestId("PluginManager__container--all")).getAllByText("Transaction Export"),
			).toHaveLength(1),
		);

		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));
		expect(within(screen.getByTestId("PluginManager__container--all")).getByTestId("PluginList")).toBeTruthy(),
			act(() => {
				fireEvent.click(screen.getByTestId("LayoutControls__grid--icon"));
			});

		expect(within(screen.getByTestId("PluginManager__container--all")).getByTestId("PluginGrid")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it.each(["utility"])("should toggle between list and grid on %s tab", async (category) => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(
				within(screen.getByTestId(`PluginManager__latest__${category}`)).getByTestId("PluginGrid"),
			).toBeTruthy(),
		);

		fireEvent.click(screen.getByTestId(`tabs__tab-button-${category}`));
		expect(
			within(screen.getByTestId(`PluginManager__container--${category}`)).getByTestId("PluginGrid"),
		).toBeTruthy();

		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));
		expect(
			within(screen.getByTestId(`PluginManager__container--${category}`)).getByTestId("PluginList"),
		).toBeTruthy();

		fireEvent.click(screen.getByTestId("LayoutControls__grid--icon"));
		expect(
			within(screen.getByTestId(`PluginManager__container--${category}`)).getByTestId("PluginGrid"),
		).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should switch to category by clicking on view all link", async () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(
				within(screen.getByTestId("PluginManager__latest__utility")).getAllByText("Transaction Export"),
			).toHaveLength(1),
		);

		fireEvent.click(screen.getByTestId("PluginManager__latest__utility__view-all"));
		expect(screen.getByTestId("PluginManager__container--utility")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it.skip("should download & install plugin on latest", async () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(screen.getByTestId("PluginManager__latest__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));

		fireEvent.click(screen.getAllByTestId("PluginListItem__install")[0]);

		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		fireEvent.click(screen.getByTestId("InstallPlugin__download-button"));

		await waitFor(() => expect(screen.getByTestId("InstallPlugin__continue-button")).toBeTruthy());

		fireEvent.click(screen.getByTestId("InstallPlugin__continue-button"));

		await waitFor(() => expect(screen.getByTestId("InstallPlugin__install-button")).toBeTruthy());

		fireEvent.click(screen.getByTestId("InstallPlugin__install-button"));

		await waitFor(() => expect(screen.getByTestId("InstallPlugin__step--third")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open and accept disclaimer", async () => {
		const mockAcceptedManualInstallation = jest
			.spyOn(profile, "hasAcceptedManualInstallationDisclaimer")
			.mockReturnValue(false);

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		fireEvent.click(screen.getByTestId("PluginManager_header--install"));

		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MANUAL_INSTALLATION_DISCLAIMER.TITLE);
		expect(screen.getByTestId("modal__inner")).toHaveTextContent(
			translations.MANUAL_INSTALLATION_DISCLAIMER.DISCLAIMER.replace(/\n\n/g, " "),
		);

		fireEvent.click(screen.getByTestId("ManualInstallationDisclaimer__accept-button"));
		await waitFor(() =>
			expect(screen.getByTestId("modal__inner")).toHaveTextContent(
				translations.MODAL_MANUAL_INSTALL_PLUGIN.TITLE,
			),
		);

		mockAcceptedManualInstallation.mockRestore();
	});

	it("should open, accept disclaimer and remember choice", async () => {
		const mockAcceptedManualInstallation = jest
			.spyOn(profile, "hasAcceptedManualInstallationDisclaimer")
			.mockReturnValue(false);

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		fireEvent.click(screen.getByTestId("PluginManager_header--install"));

		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MANUAL_INSTALLATION_DISCLAIMER.TITLE);
		expect(screen.getByTestId("modal__inner")).toHaveTextContent(
			translations.MANUAL_INSTALLATION_DISCLAIMER.DISCLAIMER.replace(/\n\n/g, " "),
		);

		fireEvent.click(screen.getByTestId("ManualInstallationDisclaimer__rememberChoice-toggle"));

		fireEvent.click(screen.getByTestId("ManualInstallationDisclaimer__accept-button"));
		await waitFor(() =>
			expect(screen.getByTestId("modal__inner")).toHaveTextContent(
				translations.MODAL_MANUAL_INSTALL_PLUGIN.TITLE,
			),
		);

		fireEvent.click(screen.getByTestId("modal__close-btn"));

		mockAcceptedManualInstallation.mockRestore();

		fireEvent.click(screen.getByTestId("PluginManager_header--install"));
		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_MANUAL_INSTALL_PLUGIN.TITLE);
	});

	it.each([
		["close", "modal__close-btn"],
		["decline", "ManualInstallationDisclaimer__decline-button"],
	])("should open and %s disclaimer", async (_, buttonId) => {
		const mockAcceptedManualInstallation = jest
			.spyOn(profile, "hasAcceptedManualInstallationDisclaimer")
			.mockReturnValue(false);

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		fireEvent.click(screen.getByTestId("PluginManager_header--install"));

		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MANUAL_INSTALLATION_DISCLAIMER.TITLE);
		expect(screen.getByTestId("modal__inner")).toHaveTextContent(
			translations.MANUAL_INSTALLATION_DISCLAIMER.DISCLAIMER.replace(/\n\n/g, " "),
		);

		fireEvent.click(screen.getByTestId(buttonId));

		await waitFor(() => expect(() => screen.getByTestId("modal__inner")).toThrow(/Unable to find an element by/));

		mockAcceptedManualInstallation.mockRestore();
	});

	it("should install plugin from header install button", async () => {
		nock("https://github.com/")
			.get("/arkecosystem/test-plugin/raw/master/package.json")
			.reply(200, { name: "test-plugin", keywords: ["@arkecosystem", "desktop-wallet"] });

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<PluginManager />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		// Open and close
		fireEvent.click(screen.getByTestId("PluginManager_header--install"));
		await waitFor(() => expect(screen.getByTestId("PluginManualInstallModal")).toBeInTheDocument());
		fireEvent.click(screen.getByTestId("modal__close-btn"));

		// Open and type
		fireEvent.click(screen.getByTestId("PluginManager_header--install"));
		await waitFor(() => expect(screen.getByTestId("PluginManualInstallModal")).toBeInTheDocument());

		fireEvent.input(screen.getByTestId("PluginManualInstallModal__input"), {
			target: { value: "https://github.com/arkecosystem/test-plugin" },
		});

		const historySpy = jest.spyOn(history, "push").mockImplementation();

		await waitFor(async () => {
			expect(screen.getByTestId("PluginManualInstallModal__submit-button")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("PluginManualInstallModal__submit-button"));

		const redirectUrl = `/profiles/${fixtureProfileId}/plugins/details?pluginId=test-plugin&repositoryURL=https://github.com/arkecosystem/test-plugin`;
		await waitFor(() => expect(historySpy).toHaveBeenCalledWith(redirectUrl));

		historySpy.mockRestore();
	});

	it("should cancel install plugin", async () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(screen.getByTestId("PluginManager__latest__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));
		await waitFor(() => expect(screen.getAllByTestId("PluginListItem__install")[0]).toBeTruthy());

		fireEvent.click(screen.getAllByTestId("PluginListItem__install")[0]);
		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		fireEvent.click(screen.getByTestId("InstallPlugin__cancel-button"));

		expect(() => screen.getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should search for plugin", async () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(screen.getByTestId("PluginManager__latest__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		fireEvent.click(within(screen.getByTestId("HeaderSearchBar")).getByRole("button"));
		expect(within(screen.getByTestId("HeaderSearchBar__input")).getByTestId("Input")).toBeTruthy();

		fireEvent.input(within(screen.getByTestId("HeaderSearchBar__input")).getByTestId("Input"), {
			target: { value: "Transaction Export" },
		});

		await waitFor(() => expect(screen.getByText(translations.PAGE_PLUGIN_MANAGER.VIEW.SEARCH)).toBeInTheDocument());
		await waitFor(() => expect(screen.getAllByTestId("PluginImage__logo")).toHaveLength(1));

		fireEvent.input(within(screen.getByTestId("HeaderSearchBar__input")).getByTestId("Input"), {
			target: { value: "unknown search query" },
		});

		await waitFor(() => expect(screen.getByTestId("PluginGrid__empty-message")).toBeInTheDocument());

		// Switch to list view
		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));

		await waitFor(() => expect(screen.getByTestId("PluginList__empty-message")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should install plugin", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:download") {
				return "/plugins/new-plugin";
			}
		});

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(screen.getByTestId("PluginManager__latest__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));
		fireEvent.click(screen.getAllByTestId("PluginListItem__install")[2]);

		await waitFor(() =>
			expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION),
		);

		fireEvent.click(screen.getByTestId("InstallPlugin__download-button"));

		await waitFor(() =>
			expect(ipcRendererSpy).toHaveBeenLastCalledWith("plugin:download", {
				name: "@dated/transaction-export-plugin",
				url: "https://github.com/dated/transaction-export-plugin/archive/master.zip",
			}),
		);

		await waitFor(() => expect(screen.getByTestId("InstallPlugin__install-button")).toBeTruthy());

		ipcRendererSpy.mockRestore();
	});

	it("should fail to install plugin", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockRejectedValue("Failed");
		const toastSpy = jest.spyOn(toasts, "error");

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(screen.getByTestId("PluginManager__latest__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));
		fireEvent.click(screen.getAllByTestId("PluginListItem__install")[2]);

		await waitFor(() =>
			expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION),
		);

		fireEvent.click(screen.getByTestId("InstallPlugin__download-button"));

		await waitFor(() =>
			expect(ipcRendererSpy).toHaveBeenLastCalledWith("plugin:download", {
				name: "@dated/transaction-export-plugin",
				url: "https://github.com/dated/transaction-export-plugin/archive/master.zip",
			}),
		);

		await waitFor(() => expect(toastSpy).toHaveBeenCalled());

		ipcRendererSpy.mockRestore();
		toastSpy.mockRestore();
	});

	it("should select plugin on latest grids", async () => {
		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		await waitFor(() => expect(screen.getAllByText("Transaction Export").length).toBeGreaterThan(0));
		await waitFor(() => expect(screen.getAllByTestId("Card")).toHaveLength(12));

		fireEvent.click(
			within(screen.getByTestId("PluginManager__latest__utility")).getAllByText("Transaction Export")[0],
		);

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/plugins/details`);
		expect(history.location.search).toEqual("?pluginId=@dated/transaction-export-plugin");
	});

	it("should enable plugin on my-plugins", async () => {
		const onEnabled = jest.fn();
		const plugin = new PluginController({ name: "test-plugin" }, onEnabled);
		pluginManager.plugins().push(plugin);

		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		await waitFor(() => expect(screen.getAllByText("Transaction Export").length).toBeGreaterThan(0));
		await waitFor(() => expect(screen.getAllByTestId("Card")).toHaveLength(12));

		fireEvent.click(screen.getByTestId("tabs__tab-button-my-plugins"));
		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));

		expect(screen.getByTestId("PluginListItem__disabled")).toBeInTheDocument();

		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getByText(commonTranslations.ENABLE),
		);

		await waitFor(() => expect(screen.getByTestId("PluginListItem__enabled")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
		expect(onEnabled).toHaveBeenCalled();

		pluginManager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should fail to enable", async () => {
		const toastSpy = jest.spyOn(toasts, "error").mockImplementation();
		const plugin = new PluginController({ name: "test-plugin" }, { incompatible: true });
		pluginManager.plugins().push(plugin);

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		await waitFor(() => expect(screen.getAllByText("Transaction Export").length).toBeGreaterThan(0));
		await waitFor(() => expect(screen.getAllByTestId("Card")).toHaveLength(12));

		fireEvent.click(screen.getByTestId("tabs__tab-button-my-plugins"));
		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));

		expect(screen.getByTestId("PluginListItem__disabled")).toBeInTheDocument();

		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getByText(commonTranslations.ENABLE),
		);

		expect(toastSpy).toHaveBeenCalled();
		pluginManager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should disable plugin on my-plugins", async () => {
		const onEnabled = jest.fn();
		const plugin = new PluginController({ name: "test-plugin" }, onEnabled);
		pluginManager.plugins().push(plugin);
		plugin.enable(profile);

		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		fireEvent.click(screen.getByTestId("tabs__tab-button-my-plugins"));
		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));

		expect(screen.getByTestId("PluginListItem__enabled")).toBeInTheDocument();

		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getByText(commonTranslations.DISABLE),
		);

		await waitFor(() => expect(screen.getByTestId("PluginListItem__disabled")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
		pluginManager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should update plugin on my-plugins", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockRejectedValue("Failed");

		const plugin = new PluginController({ name: "@dated/transaction-export-plugin", version: "0.1" }, () => void 0);
		pluginManager.plugins().push(plugin);

		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		fireEvent.click(screen.getByTestId("tabs__tab-button-my-plugins"));
		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));

		await waitFor(() => expect(screen.getByTestId("PluginListItem__update-badge")).toBeInTheDocument());

		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getByText(commonTranslations.UPDATE),
		);

		await waitFor(() =>
			expect(ipcRendererSpy).toHaveBeenCalledWith("plugin:download", {
				name: "@dated/transaction-export-plugin",
				url: "https://github.com/dated/transaction-export-plugin/archive/master.zip",
			}),
		);

		expect(asFragment()).toMatchSnapshot();
		pluginManager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should close confirmation window", async () => {
		const onEnabled = jest.fn();
		const plugin = new PluginController({ name: "test-plugin" }, onEnabled);
		pluginManager.plugins().push(plugin);

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		fireEvent.click(screen.getByTestId("tabs__tab-button-my-plugins"));
		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));

		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getByText(commonTranslations.DELETE),
		);

		await waitFor(() => expect(screen.getByTestId("PluginUninstallConfirmation")).toBeInTheDocument());

		const invokeMock = jest.spyOn(ipcRenderer, "invoke").mockResolvedValue([]);
		fireEvent.click(screen.getByTestId("PluginUninstall__cancel-button"));

		expect(() => screen.getByTestId("PluginUninstallConfirmation")).toThrow(/Unable to find an element by/);

		invokeMock.mockRestore();
	});

	it("should delete plugin on my-plugins", async () => {
		const onEnabled = jest.fn();
		pluginManager.plugins().removeById("test-plugin", profile);

		const plugin = new PluginController({ name: "test-plugin" }, onEnabled);
		pluginManager.plugins().push(plugin);

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		fireEvent.click(screen.getByTestId("tabs__tab-button-my-plugins"));
		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));

		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(
			within(screen.getByTestId("PluginManager__container--my-plugins")).getByText(commonTranslations.DELETE),
		);

		await waitFor(() => expect(screen.getByTestId("PluginUninstallConfirmation")).toBeInTheDocument());

		const invokeMock = jest.spyOn(ipcRenderer, "invoke").mockResolvedValue([]);
		fireEvent.click(screen.getByTestId("PluginUninstall__submit-button"));

		await waitFor(() => expect(pluginManager.plugins().findById(plugin.config().id())).toBeUndefined());
		expect(() => screen.getByTestId("PluginUninstallConfirmation")).toThrow(/Unable to find an element by/);

		invokeMock.mockRestore();
	});

	it("should open the plugin view page", async () => {
		const plugin = new PluginController(
			{ name: "test-plugin", "desktop-wallet": { permissions: ["LAUNCH"] } },
			(api) => api.launch().render(<h1>My Plugin View</h1>),
		);

		pluginManager.services().register([new LaunchPluginService()]);
		pluginManager.plugins().push(plugin);

		plugin.enable(profile, { autoRun: true });

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(screen.getByTestId("tabs__tab-button-my-plugins"));
		});
		act(() => {
			fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));
		});

		const historySpy = jest.spyOn(history, "push").mockImplementation();

		fireEvent.click(screen.getByTestId("PluginListItem__launch"));

		const redirectUrl = `/profiles/${profile.id()}/plugins/view?pluginId=test-plugin`;
		await waitFor(() => expect(historySpy).toHaveBeenCalledWith(redirectUrl));

		historySpy.mockRestore();
	});

	it("should show update all banner", async () => {
		const plugin = new PluginController(
			{ name: "@dated/transaction-export-plugin", version: "1.0.0" },
			() => void 0,
		);
		pluginManager.plugins().push(plugin);

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		fireEvent.click(screen.getByTestId("tabs__tab-button-my-plugins"));
		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));

		await waitFor(() => expect(screen.getByTestId("PluginManager__update-all")).toBeInTheDocument());
		pluginManager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should show and close the update confirmation modal", async () => {
		process.env.REACT_APP_PLUGIN_MINIMUM_VERSION = "100.0.0";

		const plugin = new PluginController(
			{ name: "@dated/transaction-export-plugin", version: "1.0.0" },
			() => void 0,
		);
		pluginManager.plugins().push(plugin);

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		fireEvent.click(screen.getByTestId("tabs__tab-button-my-plugins"));
		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));

		await waitFor(() => expect(screen.getByTestId("PluginManager__update-all")).toBeInTheDocument());

		fireEvent.click(screen.getByTestId("PluginManager__update-all"));

		await waitFor(() => expect(screen.getByTestId("PluginUpdatesConfirmation")).toBeInTheDocument());

		expect(screen.getByText("100.0.0")).toBeInTheDocument();

		fireEvent.click(screen.getByTestId("PluginUpdates__cancel-button"));

		expect(() => screen.getByTestId("PluginUpdatesConfirmation")).toThrow(/Unable to find an element by/);

		process.env.REACT_APP_PLUGIN_MINIMUM_VERSION = undefined;
		pluginManager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should show and continue the update confirmation modal", async () => {
		process.env.REACT_APP_PLUGIN_MINIMUM_VERSION = "100.0.0";

		let downloadsCount = 0;
		let installCount = 0;

		jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:download") {
				downloadsCount++;
				return "/plugins/new-plugin";
			}

			if (channel === "plugin:install") {
				installCount++;
				return "/plugins/test-plugin";
			}
		});

		const plugin = new PluginController(
			{ name: "@dated/transaction-export-plugin", version: "1.0.0" },
			() => void 0,
		);
		const plugin2 = new PluginController(
			{ name: "@dated/delegate-calculator-plugin", version: "1.0.0" },
			() => void 0,
		);
		pluginManager.plugins().push(plugin);
		pluginManager.plugins().push(plugin2);

		renderWithRouter(
			<Route path="/profiles/:profileId/plugins">
				<PluginProviders>
					<Component />
				</PluginProviders>
			</Route>,
			{
				routes: [pluginsURL],
				history,
			},
		);

		fireEvent.click(screen.getByTestId("tabs__tab-button-my-plugins"));
		fireEvent.click(screen.getByTestId("LayoutControls__list--icon"));

		await waitFor(() => expect(screen.getByTestId("PluginManager__update-all")).toBeInTheDocument());

		fireEvent.click(screen.getByTestId("PluginManager__update-all"));

		await waitFor(() => expect(screen.getByTestId("PluginUpdatesConfirmation")).toBeInTheDocument());

		expect(screen.getAllByText("100.0.0").length).toBeGreaterThan(0);

		fireEvent.click(screen.getByTestId("PluginUpdates__continue-button"));

		await waitFor(() => expect(downloadsCount).toBe(2));
		await waitFor(() => expect(installCount).toBe(2));

		process.env.REACT_APP_PLUGIN_MINIMUM_VERSION = undefined;
	});
});
