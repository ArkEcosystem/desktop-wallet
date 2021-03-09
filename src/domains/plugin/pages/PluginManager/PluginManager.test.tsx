/* eslint-disable @typescript-eslint/require-await */
import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { pluginManager, PluginProviders } from "app/PluginProviders";
import { toasts } from "app/services";
import { ipcRenderer } from "electron";
import { createMemoryHistory } from "history";
import nock from "nock";
import { LaunchPluginService, PluginController } from "plugins";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, getDefaultProfileId, RenderResult, renderWithRouter, waitFor, within } from "testing-library";
import { env } from "utils/testing-library";

import { translations } from "../../i18n";
import { PluginManager } from "./PluginManager";

let rendered: RenderResult;
let profile: Profile;
const history = createMemoryHistory();

const fixtureProfileId = getDefaultProfileId();
const pluginsURL = `/profiles/${fixtureProfileId}/plugins`;

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
			.persist();

		profile = env.profiles().findById(getDefaultProfileId());
		history.push(pluginsURL);

		await act(async () => {
			rendered = renderWithRouter(
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
		});
	});

	it("should render", async () => {
		const { asFragment, getByTestId, getAllByTestId } = rendered;

		expect(getByTestId("header__title")).toHaveTextContent(translations.PAGE_PLUGIN_MANAGER.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.PAGE_PLUGIN_MANAGER.DESCRIPTION);

		await waitFor(() =>
			expect(within(getByTestId("PluginManager__home__utility")).getAllByText("Transaction Export")).toHaveLength(
				1,
			),
		);

		await waitFor(() => expect(getAllByTestId("Card")).toHaveLength(12));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle between list and grid on home", async () => {
		const { asFragment, getByTestId, getAllByText, getAllByTestId } = rendered;

		await waitFor(() =>
			expect(within(getByTestId("PluginManager__home__utility")).getAllByText("Transaction Export")).toHaveLength(
				1,
			),
		);

		await waitFor(() => expect(getAllByTestId("Card")).toHaveLength(12));

		await waitFor(() =>
			expect(within(getByTestId("PluginManager__home__utility")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		expect(within(getByTestId("PluginManager__home__utility")).getByTestId("PluginList")).toBeTruthy(),
			act(() => {
				fireEvent.click(getByTestId("LayoutControls__grid--icon"));
			});

		expect(within(getByTestId("PluginManager__home__utility")).getByTestId("PluginGrid")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it.each(["utility"])("should toggle between list and grid on %s tab", async (category) => {
		const { asFragment, getByTestId, getAllByText } = rendered;

		await waitFor(() =>
			expect(within(getByTestId(`PluginManager__home__${category}`)).getByTestId("PluginGrid")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(getByTestId(`PluginManagerNavigationBar__${category}`));
		});

		expect(within(getByTestId(`PluginManager__container--${category}`)).getByTestId("PluginGrid")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		expect(within(getByTestId(`PluginManager__container--${category}`)).getByTestId("PluginList")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__grid--icon"));
		});

		expect(within(getByTestId(`PluginManager__container--${category}`)).getByTestId("PluginGrid")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it.each(["gaming", "utility", "exchange", "other"])(
		"should switch to %s category by clicking on view more link",
		async (category) => {
			const { asFragment, getByTestId, getAllByText } = rendered;

			await waitFor(() =>
				expect(within(getByTestId(`PluginManager__home__${category}`)).getByTestId("PluginGrid")).toBeTruthy(),
			);

			act(() => {
				fireEvent.click(getByTestId(`PluginManager__home__${category}__view-more`));
			});

			expect(getByTestId(`PluginManager__container--${category}`)).toBeTruthy();

			expect(asFragment()).toMatchSnapshot();
		},
	);

	it.skip("should download & install plugin on home", async () => {
		const { asFragment, getAllByTestId, queryAllByTestId, getByTestId } = rendered;

		await waitFor(() =>
			expect(within(getByTestId("PluginManager__home__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		act(() => {
			fireEvent.click(getAllByTestId("PluginListItem__install")[0]);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId("InstallPlugin__download-button"));
		});

		await waitFor(() => expect(getByTestId("InstallPlugin__continue-button")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("InstallPlugin__continue-button"));
		});

		await waitFor(() => expect(getByTestId("InstallPlugin__install-button")).toBeTruthy());
		act(() => {
			fireEvent.click(getByTestId("InstallPlugin__install-button"));
		});

		await waitFor(() => expect(getByTestId(`InstallPlugin__step--third`)).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should install plugin from header install button", async () => {
		nock("https://github.com/")
			.get("/arkecosystem/test-plugin/raw/master/package.json")
			.reply(200, { name: "test-plugin", keywords: ["@arkecosystem", "desktop-wallet"] });

		profile.settings().set(ProfileSetting.AdvancedMode, true);

		const { getByTestId, queryByTestId } = renderWithRouter(
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

		await waitFor(() => expect(queryByTestId("PluginManager_header--install")).toBeInTheDocument());

		// Open and close
		act(() => {
			fireEvent.click(queryByTestId("PluginManager_header--install"));
		});
		await waitFor(() => expect(queryByTestId("PluginManualInstallModal")).toBeInTheDocument());
		act(() => {
			fireEvent.click(queryByTestId("modal__close-btn"));
		});

		// Open and type
		act(() => {
			fireEvent.click(queryByTestId("PluginManager_header--install"));
		});
		await waitFor(() => expect(queryByTestId("PluginManualInstallModal")).toBeInTheDocument());

		act(() => {
			fireEvent.input(getByTestId("PluginManualInstallModal__input"), {
				target: { value: "https://github.com/arkecosystem/test-plugin" },
			});
		});

		const historySpy = jest.spyOn(history, "push").mockImplementation();

		act(() => {
			fireEvent.click(getByTestId("PluginManualInstallModal__submit-button"));
		});

		const redirectUrl = `/profiles/${fixtureProfileId}/plugins/details?pluginId=test-plugin&repositoryURL=https://github.com/arkecosystem/test-plugin`;
		await waitFor(() => expect(historySpy).toHaveBeenCalledWith(redirectUrl));

		historySpy.mockRestore();
		profile.settings().set(ProfileSetting.AdvancedMode, false);
	});

	it.skip("should install a plugin from other category", async () => {
		const { asFragment, getByTestId, getAllByTestId } = rendered;

		await waitFor(() =>
			expect(within(getByTestId("PluginManager__home__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManagerNavigationBar__other"));
		});

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		await waitFor(() => expect(getByTestId("PluginManager__container--other")).toBeTruthy());
		await waitFor(() => expect(getAllByTestId("PluginListItem__install")[0]).toBeTruthy());

		act(() => {
			fireEvent.click(getAllByTestId("PluginListItem__install")[0]);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId("InstallPlugin__download-button"));
		});

		await waitFor(() => expect(getByTestId("InstallPlugin__continue-button")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("InstallPlugin__continue-button"));
		});

		await waitFor(() => expect(getByTestId("InstallPlugin__install-button")).toBeTruthy());
		act(() => {
			fireEvent.click(getByTestId("InstallPlugin__install-button"));
		});

		await waitFor(() => expect(getByTestId(`InstallPlugin__step--third`)).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it.skip("should close install plugin modal", async () => {
		const { asFragment, getAllByTestId, getByTestId } = rendered;

		await waitFor(() =>
			expect(within(getByTestId("PluginManager__home__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		await waitFor(() => expect(getAllByTestId("PluginListItem__install")[0]).toBeTruthy());

		act(() => {
			fireEvent.click(getAllByTestId("PluginListItem__install")[0]);
		});

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should cancel install plugin", async () => {
		const { asFragment, getAllByTestId, getByTestId } = rendered;

		await waitFor(() =>
			expect(within(getByTestId("PluginManager__home__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		await waitFor(() => expect(getAllByTestId("PluginListItem__install")[0]).toBeTruthy());

		act(() => {
			fireEvent.click(getAllByTestId("PluginListItem__install")[0]);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId("InstallPlugin__cancel-button"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should search for plugin", async () => {
		const { asFragment, getByTestId, getAllByTestId, getAllByText } = rendered;

		await waitFor(() =>
			expect(within(getByTestId("PluginManager__home__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
		});

		await waitFor(() => expect(within(getByTestId("header-search-bar__input")).getByTestId("Input")).toBeTruthy());

		act(() => {
			fireEvent.input(within(getByTestId("header-search-bar__input")).getByTestId("Input"), {
				target: { value: "Transaction Export" },
			});
		});

		await waitFor(() => expect(getAllByText(commonTranslations.AUTHOR)).toHaveLength(11));

		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.input(within(getByTestId("header-search-bar__input")).getByTestId("Input"), {
				target: { value: "unknown search query" },
			});
		});

		await waitFor(() => expect(getAllByText(commonTranslations.AUTHOR)).toHaveLength(12));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should install plugin", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
			if (channel === "plugin:download") {
				return "/plugins/new-plugin";
			}
		});

		const { getAllByTestId, getByTestId } = rendered;

		await waitFor(() =>
			expect(within(getByTestId("PluginManager__home__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		act(() => {
			fireEvent.click(getAllByTestId("PluginListItem__install")[1]);
		});

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION),
		);

		act(() => {
			fireEvent.click(getByTestId("InstallPlugin__download-button"));
		});

		await waitFor(() =>
			expect(ipcRendererSpy).toHaveBeenLastCalledWith("plugin:download", {
				name: "@dated/transaction-export-plugin",
				url: "https://github.com/dated/transaction-export-plugin/archive/master.zip",
			}),
		);
		await waitFor(() => expect(getByTestId("InstallPlugin__install-button")).toBeTruthy());

		ipcRendererSpy.mockRestore();
	});

	it("should fail to install plugin", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockRejectedValue("Failed");
		const toastSpy = jest.spyOn(toasts, "error");

		const { getAllByTestId, getByTestId } = rendered;

		await waitFor(() =>
			expect(within(getByTestId("PluginManager__home__gaming")).getByTestId("PluginGrid")).toBeTruthy(),
		);

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		act(() => {
			fireEvent.click(getAllByTestId("PluginListItem__install")[1]);
		});

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION),
		);

		act(() => {
			fireEvent.click(getByTestId("InstallPlugin__download-button"));
		});

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

	it("should select plugin on home grids", async () => {
		const { getByTestId, getAllByText, getAllByTestId } = rendered;

		await waitFor(() => expect(getAllByText("Transaction Export").length).toBeGreaterThan(0));
		await waitFor(() => expect(getAllByTestId("Card")).toHaveLength(12));

		act(() => {
			fireEvent.click(within(getByTestId("PluginManager__home__utility")).getAllByText("Transaction Export")[0]);
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/plugins/details`);
		expect(history.location.search).toEqual("?pluginId=@dated/transaction-export-plugin");
	});

	it("should enable plugin on my-plugins", async () => {
		const onEnabled = jest.fn();
		const plugin = new PluginController({ name: "test-plugin" }, onEnabled);
		pluginManager.plugins().push(plugin);

		const { asFragment, getByTestId, getAllByText, getAllByTestId } = rendered;

		await waitFor(() => expect(getAllByText("Transaction Export").length).toBeGreaterThan(0));
		await waitFor(() => expect(getAllByTestId("Card")).toHaveLength(12));

		fireEvent.click(getByTestId("PluginManagerNavigationBar__my-plugins"));
		fireEvent.click(getByTestId("LayoutControls__list--icon"));

		expect(getByTestId("PluginListItem__disabled")).toBeInTheDocument();

		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getByText(commonTranslations.ENABLE),
		);

		await waitFor(() => expect(getByTestId("PluginListItem__enabled")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
		expect(onEnabled).toHaveBeenCalled();
		pluginManager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should disable plugin on my-plugins", async () => {
		const onEnabled = jest.fn();
		const plugin = new PluginController({ name: "test-plugin" }, onEnabled);
		pluginManager.plugins().push(plugin);
		plugin.enable(profile);

		const { asFragment, getByTestId } = rendered;

		fireEvent.click(getByTestId("PluginManagerNavigationBar__my-plugins"));
		fireEvent.click(getByTestId("LayoutControls__list--icon"));

		expect(getByTestId("PluginListItem__enabled")).toBeInTheDocument();

		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getByText(commonTranslations.DISABLE),
		);

		await waitFor(() => expect(getByTestId("PluginListItem__disabled")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
		pluginManager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should update plugin on my-plugins", async () => {
		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockRejectedValue("Failed");

		const plugin = new PluginController({ name: "@dated/transaction-export-plugin", version: "0.1" }, () => void 0);
		pluginManager.plugins().push(plugin);

		const { asFragment, getByTestId } = rendered;

		fireEvent.click(getByTestId("PluginManagerNavigationBar__my-plugins"));
		fireEvent.click(getByTestId("LayoutControls__list--icon"));

		await waitFor(() => expect(getByTestId("PluginListItem__update-badge")).toBeInTheDocument());

		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getByText(commonTranslations.UPDATE),
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

		const { getByTestId, queryByTestId } = rendered;

		fireEvent.click(getByTestId("PluginManagerNavigationBar__my-plugins"));
		fireEvent.click(getByTestId("LayoutControls__list--icon"));

		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getByText(commonTranslations.DELETE),
		);

		await waitFor(() => expect(getByTestId("PluginUninstallConfirmation")).toBeInTheDocument());

		const invokeMock = jest.spyOn(ipcRenderer, "invoke").mockResolvedValue([]);
		fireEvent.click(getByTestId("PluginUninstall__cancel-button"));

		await waitFor(() => expect(queryByTestId("PluginUninstallConfirmation")).not.toBeInTheDocument());

		invokeMock.mockRestore();
	});

	it("should delete plugin on my-plugins", async () => {
		const onEnabled = jest.fn();
		pluginManager.plugins().removeById("test-plugin", profile);

		const plugin = new PluginController({ name: "test-plugin" }, onEnabled);
		pluginManager.plugins().push(plugin);

		const { getByTestId, queryByTestId } = rendered;

		fireEvent.click(getByTestId("PluginManagerNavigationBar__my-plugins"));
		fireEvent.click(getByTestId("LayoutControls__list--icon"));

		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getByText(commonTranslations.DELETE),
		);

		await waitFor(() => expect(getByTestId("PluginUninstallConfirmation")).toBeInTheDocument());

		const invokeMock = jest.spyOn(ipcRenderer, "invoke").mockResolvedValue([]);
		fireEvent.click(getByTestId("PluginUninstall__submit-button"));

		await waitFor(() => expect(pluginManager.plugins().findById(plugin.config().id())).toBeUndefined());
		await waitFor(() => expect(queryByTestId("PluginUninstallConfirmation")).not.toBeInTheDocument());

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

		const { getByTestId } = rendered;

		act(() => {
			fireEvent.click(getByTestId("PluginManagerNavigationBar__my-plugins"));
		});
		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		const historySpy = jest.spyOn(history, "push").mockImplementation();

		act(() => {
			fireEvent.click(getByTestId("PluginListItem__launch"));
		});

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

		const { getByTestId } = rendered;

		fireEvent.click(getByTestId("PluginManagerNavigationBar__my-plugins"));
		fireEvent.click(getByTestId("LayoutControls__list--icon"));

		await waitFor(() => expect(getByTestId("PluginManager__update-all")).toBeInTheDocument());
		pluginManager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should handle update all", async () => {
		let downloadsCount = 0;
		let installCount = 0;

		const ipcRendererSpy = jest.spyOn(ipcRenderer, "invoke").mockImplementation((channel) => {
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

		const { getByTestId, container } = rendered;

		fireEvent.click(getByTestId("PluginManagerNavigationBar__my-plugins"));
		fireEvent.click(getByTestId("LayoutControls__list--icon"));

		await waitFor(() => expect(getByTestId("PluginManager__update-all")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("PluginManager__update-all"));
		});

		await waitFor(() => expect(downloadsCount).toBe(2));
		await waitFor(() => expect(installCount).toBe(2));

		expect(container).toMatchSnapshot();
	});
});
