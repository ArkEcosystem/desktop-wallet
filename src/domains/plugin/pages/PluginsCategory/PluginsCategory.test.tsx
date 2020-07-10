import { act } from "@testing-library/react-hooks";
import React from "react";
import TestUtils from "react-dom/test-utils";
import { fireEvent, render, within } from "testing-library";

// i18n
import { translations } from "../../i18n";
import { PluginsCategory } from "./PluginsCategory";

jest.useFakeTimers();

describe("PluginsCategory", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<PluginsCategory title="Top Rated plugins" description="Easy way to find, manage and install plugins" />,
		);

		expect(getByTestId("PluginsCategory")).toHaveTextContent("Top Rated plugins");
		expect(getByTestId("PluginsCategory")).toHaveTextContent("Easy way to find, manage and install plugins");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle between list and grid", () => {
		const { asFragment, getByTestId } = render(
			<PluginsCategory title="Top Rated plugins" description="Easy way to find, manage and install plugins" />,
		);

		const pluginsContainer = getByTestId("PluginsCategory__plugins");
		expect(within(pluginsContainer).getByTestId("PluginList")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		expect(within(pluginsContainer).getByTestId("PluginList")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__grid--icon"));
		});

		expect(within(pluginsContainer).getByTestId("PluginGrid")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should install plugin from header install button", () => {
		const { asFragment, getByTestId } = render(
			<PluginsCategory title="Top Rated plugins" description="Easy way to find, manage and install plugins" />,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginsCategory_header--install"));
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

	it("should download & install plugin", () => {
		const { asFragment, getByTestId, getAllByTestId } = render(
			<PluginsCategory title="Top Rated plugins" description="Easy way to find, manage and install plugins" />,
		);

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

	it("should close install plugin modal", () => {
		const { asFragment, getByTestId, getAllByTestId } = render(
			<PluginsCategory title="Top Rated plugins" description="Easy way to find, manage and install plugins" />,
		);

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
		const { asFragment, getByTestId, getAllByTestId } = render(
			<PluginsCategory title="Top Rated plugins" description="Easy way to find, manage and install plugins" />,
		);

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

	it("should search for plugin", (done) => {
		const consoleSpy = jest.spyOn(global.console, "log").mockImplementation();

		const { asFragment, getByTestId } = render(
			<PluginsCategory title="Top Rated plugins" description="Easy way to find, manage and install plugins" />,
		);

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
			fireEvent.change(within(getByTestId("header-search-bar__input")).getByTestId("Input"), {
				target: { value: "test" },
			});
		});

		setTimeout(() => {
			// expect(onSearch).toHaveBeenCalled();
			expect(consoleSpy).toHaveBeenCalledTimes(1);
			expect(consoleSpy).toHaveBeenCalledWith("search");
			expect(asFragment()).toMatchSnapshot();
			consoleSpy.mockRestore();
			done();
		}, 550);

		TestUtils.act(() => {
			jest.runAllTimers();
		});
	});

	it("should select plugin on grid", () => {
		const consoleSpy = jest.spyOn(global.console, "log").mockImplementation();

		const { asFragment, getByTestId } = render(
			<PluginsCategory
				title="Top Rated plugins"
				description="Easy way to find, manage and install plugins"
				initialViewType="grid"
			/>,
		);

		const pluginsContainer = getByTestId("PluginsCategory__plugins");

		act(() => {
			fireEvent.click(within(pluginsContainer).getByTestId("PluginCard--ark-explorer-1"));
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("selected");

		act(() => {
			fireEvent.click(within(pluginsContainer).getByTestId("PluginCard--ark-explorer-1"));
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("selected");

		act(() => {
			fireEvent.click(within(pluginsContainer).getByTestId("PluginCard--ark-explorer-1"));
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("selected");
		expect(consoleSpy).toHaveBeenCalledTimes(3);
		expect(asFragment()).toMatchSnapshot();

		consoleSpy.mockRestore();
	});

	it("should delete plugin", () => {
		const consoleSpy = jest.spyOn(global.console, "log").mockImplementation();

		const { asFragment, getByTestId, getAllByTestId } = render(
			<PluginsCategory title="Top Rated plugins" description="Easy way to find, manage and install plugins" />,
		);
		const pluginsContainer = getByTestId("PluginsCategory__plugins");

		act(() => {
			fireEvent.click(within(pluginsContainer).getAllByTestId("dropdown__toggle")[0]);
			fireEvent.click(within(pluginsContainer).getByTestId("dropdown__option--1"));
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("delete");
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();

		consoleSpy.mockRestore();
	});
});
