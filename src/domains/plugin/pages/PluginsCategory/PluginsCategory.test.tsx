import { act } from "@testing-library/react-hooks";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { createMemoryHistory } from "history";
import { PluginManager, PluginManagerProvider } from "plugins";
import React from "react";
import { Route } from "react-router-dom";
import { fireEvent, getDefaultProfileId, RenderResult, renderWithRouter, waitFor, within } from "testing-library";

import { translations } from "../../i18n";
import { PluginsCategory } from "./PluginsCategory";

let consoleSpy: any;
let rendered = RenderResult;
const history = createMemoryHistory();

const pluginsCategoryURL = `/profiles/${getDefaultProfileId()}/plugins/categories/game`;

describe("PluginsCategory", () => {
	beforeAll(() => {
		consoleSpy = jest.spyOn(global.console, "log").mockImplementation();
	});

	beforeEach(() => {
		history.push(pluginsCategoryURL);

		rendered = renderWithRouter(
			<Route path="/profiles/:profileId/plugins/categories/:categoryId">
				<PluginManagerProvider manager={new PluginManager()} services={[]}>
					<PluginsCategory
						title="Top Rated plugins"
						description="Easy way to find, manage and install plugins"
						initialViewType="grid"
					/>
				</PluginManagerProvider>
			</Route>,
			{
				routes: [pluginsCategoryURL],
				history,
			},
		);

		consoleSpy.mockReset();
	});

	afterAll(() => {
		consoleSpy.mockRestore();
	});

	it("should render", () => {
		const { asFragment, getByTestId } = rendered;

		expect(getByTestId("header__title")).toHaveTextContent("Top Rated plugins");
		expect(getByTestId("header__subtitle")).toHaveTextContent("Easy way to find, manage and install plugins");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle between grid and list", () => {
		const { asFragment, getByTestId } = rendered;

		const pluginsContainer = getByTestId("PluginsCategory__plugins");
		expect(within(pluginsContainer).getByTestId("PluginGrid")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__grid--icon"));
		});

		expect(within(pluginsContainer).getByTestId("PluginGrid")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		expect(within(pluginsContainer).getByTestId("PluginList")).toBeTruthy();

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

	it("should select plugin on grid", () => {
		const { asFragment, getAllByText, getByTestId } = rendered;

		const pluginsContainer = getByTestId("PluginsCategory__plugins");

		act(() => {
			fireEvent.click(within(pluginsContainer).getAllByText("ARK Explorer")[0]);
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("selected");

		act(() => {
			fireEvent.click(within(pluginsContainer).getAllByText("ARK Explorer")[0]);
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("selected");

		act(() => {
			fireEvent.click(within(pluginsContainer).getAllByText("ARK Explorer")[0]);
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("selected");
		expect(consoleSpy).toHaveBeenCalledTimes(3);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete plugin", () => {
		const { asFragment, getByTestId } = rendered;

		const pluginsContainer = getByTestId("PluginsCategory__plugins");

		act(() => {
			fireEvent.click(within(pluginsContainer).getAllByTestId("dropdown__toggle")[6]);
			fireEvent.click(within(pluginsContainer).getByText(commonTranslations.DELETE));
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("delete");
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});
});
