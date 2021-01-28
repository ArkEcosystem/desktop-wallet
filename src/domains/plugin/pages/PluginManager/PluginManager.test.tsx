/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { act } from "@testing-library/react-hooks";
import { pluginManager, PluginProviders } from "app/PluginProviders";
import { createMemoryHistory } from "history";
import nock from "nock";
import { PluginController } from "plugins";
import React from "react";
import { Route } from "react-router-dom";
import { fireEvent, getDefaultProfileId, RenderResult, renderWithRouter, waitFor, within } from "testing-library";
import { env } from "utils/testing-library";

import { translations } from "../../i18n";
import { PluginManager } from "./PluginManager";

let consoleSpy: any;
let rendered: RenderResult;
let profile: Profile;
const history = createMemoryHistory();

const fixtureProfileId = getDefaultProfileId();
const pluginsURL = `/profiles/${fixtureProfileId}/plugins`;

describe("PluginManager", () => {
	beforeAll(() => {
		consoleSpy = jest.spyOn(global.console, "log").mockImplementation();
	});

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

			consoleSpy.mockReset();
		});
	});

	afterAll(() => {
		consoleSpy.mockRestore();
	});

	it("should render", () => {
		const { asFragment, getByTestId } = rendered;

		expect(getByTestId("header__title")).toHaveTextContent(translations.PAGE_PLUGIN_MANAGER.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.PAGE_PLUGIN_MANAGER.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle between list and grid on home", async () => {
		const { asFragment, getByTestId, getAllByText } = rendered;

		await waitFor(() => expect(getAllByText("Transaction Export Plugin").length).toBeGreaterThan(0));

		expect(within(getByTestId("PluginManager__home__featured")).getByTestId("PluginGrid")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		expect(within(getByTestId("PluginManager__home__featured")).getByTestId("PluginList")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__grid--icon"));
		});

		expect(within(getByTestId("PluginManager__home__featured")).getByTestId("PluginGrid")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle between list and grid on game", async () => {
		const { asFragment, getByTestId, getAllByText } = rendered;

		await waitFor(() => expect(getAllByText("Transaction Export Plugin").length).toBeGreaterThan(0));

		act(() => {
			fireEvent.click(getByTestId("PluginManagerNavigationBar__gaming"));
		});

		expect(within(getByTestId("PluginManager__container--gaming")).getByTestId("PluginGrid")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		expect(within(getByTestId("PluginManager__container--gaming")).getByTestId("PluginList")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__grid--icon"));
		});

		expect(within(getByTestId("PluginManager__container--gaming")).getByTestId("PluginGrid")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should download & install plugin on home", async () => {
		const { asFragment, getAllByTestId, queryAllByTestId, getByTestId } = rendered;

		fireEvent.click(getByTestId("LayoutControls__list--icon"));
		await waitFor(() => expect(queryAllByTestId("PluginListItem__install").length).toBeGreaterThan(0));

		fireEvent.click(getAllByTestId("PluginListItem__install")[0]);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId("InstallPlugin__download-button"));
			fireEvent.click(getByTestId("InstallPlugin__continue-button"));
			fireEvent.click(getByTestId("InstallPlugin__install-button"));
		});

		expect(getByTestId(`InstallPlugin__step--third`)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should install plugin from header install button", () => {
		const { asFragment, getByTestId } = rendered;

		act(() => {
			fireEvent.click(getByTestId("PluginManager_header--install"));
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId("InstallPlugin__download-button"));
			fireEvent.click(getByTestId("InstallPlugin__continue-button"));
			fireEvent.click(getByTestId("InstallPlugin__install-button"));
		});

		expect(getByTestId(`InstallPlugin__step--third`)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should close install plugin modal", () => {
		const { asFragment, getAllByTestId, getByTestId } = rendered;

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
			fireEvent.click(getAllByTestId("PluginListItem__install")[0]);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should cancel install plugin", () => {
		const { asFragment, getAllByTestId, getByTestId } = rendered;

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
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
		const { asFragment, getByTestId } = rendered;

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
			fireEvent.change(within(getByTestId("header-search-bar__input")).getByTestId("Input"), {
				target: { value: "test" },
			});
		});

		await waitFor(() => expect(consoleSpy).toHaveBeenCalledTimes(1));
		expect(consoleSpy).toHaveBeenCalledWith("search");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select plugin on home grids", async () => {
		const { getByTestId, getAllByText } = rendered;

		await waitFor(() => expect(getAllByText("Transaction Export Plugin").length).toBeGreaterThan(0));

		act(() => {
			fireEvent.click(
				within(getByTestId("PluginManager__home__top-rated")).getAllByText("Transaction Export Plugin")[0],
			);
		});

		expect(history.location.pathname).toEqual(
			`/profiles/${fixtureProfileId}/plugins/@dated/transaction-export-plugin`,
		);
	});

	it("should enable plugin on my-plugins", async () => {
		const onEnabled = jest.fn();
		const plugin = new PluginController({ name: "test-plugin" }, onEnabled);
		pluginManager.plugins().push(plugin);

		const { asFragment, getByTestId } = rendered;

		fireEvent.click(getByTestId("PluginManagerNavigationBar__my-plugins"));
		fireEvent.click(getByTestId("LayoutControls__list--icon"));

		expect(getByTestId("PluginListItem__disabled")).toBeInTheDocument();

		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(within(getByTestId("PluginManager__container--my-plugins")).getByTestId("dropdown__option--1"));

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
		fireEvent.click(within(getByTestId("PluginManager__container--my-plugins")).getByTestId("dropdown__option--1"));

		await waitFor(() => expect(getByTestId("PluginListItem__disabled")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
		pluginManager.plugins().removeById(plugin.config().id(), profile);
	});

	it("should delete plugin on my-plugins", async () => {
		const onEnabled = jest.fn();
		const plugin = new PluginController({ name: "test-plugin" }, onEnabled);
		pluginManager.plugins().push(plugin);

		const { getByTestId } = rendered;

		fireEvent.click(getByTestId("PluginManagerNavigationBar__my-plugins"));
		fireEvent.click(getByTestId("LayoutControls__list--icon"));

		fireEvent.click(
			within(getByTestId("PluginManager__container--my-plugins")).getAllByTestId("dropdown__toggle")[0],
		);
		fireEvent.click(within(getByTestId("PluginManager__container--my-plugins")).getByTestId("dropdown__option--0"));

		expect(consoleSpy).toHaveBeenLastCalledWith("delete");

		pluginManager.plugins().removeById(plugin.config().id(), profile);
	});
});
