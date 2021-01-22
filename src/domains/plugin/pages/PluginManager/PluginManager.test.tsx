/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { act } from "@testing-library/react-hooks";
import { pluginManager, PluginProviders } from "app/PluginProviders";
import { createMemoryHistory } from "history";
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

	it("should toggle between list and grid on home", () => {
		const { asFragment, getByTestId } = rendered;

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

	it("should toggle between list and grid on game", () => {
		const { asFragment, getByTestId } = rendered;

		act(() => {
			fireEvent.click(getByTestId("PluginManagerNavigationBar__game"));
		});

		expect(within(getByTestId("PluginManager__container--game")).getByTestId("PluginGrid")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		expect(within(getByTestId("PluginManager__container--game")).getByTestId("PluginList")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__grid--icon"));
		});

		expect(within(getByTestId("PluginManager__container--game")).getByTestId("PluginGrid")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should download & install plugin on home", () => {
		const { asFragment, getAllByTestId, getByTestId } = rendered;

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
			fireEvent.click(getAllByTestId("PluginListItem__install")[0]);
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

	it("should download & install plugin on game", () => {
		const { asFragment, getAllByTestId, getByTestId } = rendered;

		act(() => {
			fireEvent.click(getByTestId("PluginManagerNavigationBar__game"));
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
			fireEvent.click(getAllByTestId("PluginListItem__install")[0]);
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

	it("should select plugin on home grids", () => {
		const { getByTestId, getAllByText } = rendered;

		act(() => {
			fireEvent.click(within(getByTestId("PluginManager__home__top-rated")).getAllByText("ARK Explorer")[0]);
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/plugins/0`);
	});

	it("should select plugin on game grid", () => {
		const { asFragment, getAllByText, getByTestId } = rendered;

		act(() => {
			fireEvent.click(getByTestId("PluginManagerNavigationBar__game"));
			fireEvent.click(getAllByText("ARK Explorer")[0]);
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/plugins/0`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete plugin on home", () => {
		const { asFragment, getByTestId } = rendered;

		act(() => {
			fireEvent.click(within(getByTestId("PluginManager__home__featured")).getAllByTestId("dropdown__toggle")[0]);
			fireEvent.click(within(getByTestId("PluginManager__home__featured")).getByTestId("dropdown__option--0"));
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("delete");
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete plugin on game", () => {
		const { asFragment, getByTestId } = rendered;

		act(() => {
			fireEvent.click(getByTestId("PluginManagerNavigationBar__game"));
			fireEvent.click(
				within(getByTestId("PluginManager__container--game")).getAllByTestId("dropdown__toggle")[1],
			);
			fireEvent.click(within(getByTestId("PluginManager__container--game")).getByTestId("dropdown__option--0"));
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("delete");

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
			fireEvent.click(
				within(getByTestId("PluginManager__container--game")).getAllByTestId("dropdown__toggle")[1],
			);
			fireEvent.click(within(getByTestId("PluginManager__container--game")).getByTestId("dropdown__option--0"));
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("delete");
		expect(consoleSpy).toHaveBeenCalledTimes(4);
		expect(asFragment()).toMatchSnapshot();
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
});
