import { fireEvent, render, within } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

// i18n
import { translations } from "../../i18n";
import { PluginManager } from "./PluginManager";

jest.useFakeTimers();

describe("PluginManager", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		expect(getByTestId("PluginManager")).toHaveTextContent(translations.PAGE_PLUGIN_MANAGER.TITLE);
		expect(getByTestId("PluginManager")).toHaveTextContent(translations.PAGE_PLUGIN_MANAGER.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle between list and grid on home", () => {
		const { asFragment, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		expect(within(getByTestId("PluginManager__home__featured")).getByTestId("PluginGrid")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("PluginManagerControls__list--icon"));
		});

		expect(within(getByTestId("PluginManager__home__featured")).getByTestId("PluginList")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("PluginManagerControls__grid--icon"));
		});

		expect(within(getByTestId("PluginManager__home__featured")).getByTestId("PluginGrid")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle between list and grid on game", () => {
		const { asFragment, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManagerNavigationBar__game"));
		});

		expect(within(getByTestId("PluginManager__container--game")).getByTestId("PluginGrid")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("PluginManagerControls__list--icon"));
		});

		expect(within(getByTestId("PluginManager__container--game")).getByTestId("PluginList")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("PluginManagerControls__grid--icon"));
		});

		expect(within(getByTestId("PluginManager__container--game")).getByTestId("PluginGrid")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open & close featured modal", () => {
		const { asFragment, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManager__home__featured__view-more"));
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_FEATURED_PLUGINS.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open & close top rated modal", () => {
		const { asFragment, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManager__home__top-rated__view-more"));
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BEST_PLUGINS.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should download & install plugin on home", () => {
		const { asFragment, getAllByTestId, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManagerControls__list--icon"));
			fireEvent.click(getAllByTestId("PluginListItem__install")[0]);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId("install-plugin__download-button"));
		});

		jest.runAllTimers();

		expect(setTimeout).toHaveBeenCalled();
		expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

		act(() => {
			fireEvent.click(getByTestId("install-plugin__install-button"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should download & install plugin on game", () => {
		const { asFragment, getAllByTestId, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManagerNavigationBar__game"));
			fireEvent.click(getByTestId("PluginManagerControls__list--icon"));
			fireEvent.click(getAllByTestId("PluginListItem__install")[0]);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId("install-plugin__download-button"));
		});

		jest.runAllTimers();

		expect(setTimeout).toHaveBeenCalled();
		expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

		act(() => {
			fireEvent.click(getByTestId("install-plugin__install-button"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should close install plugin modal", () => {
		const { asFragment, getAllByTestId, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManagerControls__list--icon"));
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
		const { asFragment, getAllByTestId, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManagerControls__list--icon"));
			fireEvent.click(getAllByTestId("PluginListItem__install")[0]);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_INSTALL_PLUGIN.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId("install-plugin__cancel-button"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should search for plugin", (done) => {
		const consoleSpy = jest.spyOn(global.console, "log").mockImplementation();

		const { asFragment, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
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

		jest.runAllTimers();
	});

	it("should select plugin on home grids", () => {
		const consoleSpy = jest.spyOn(global.console, "log").mockImplementation();

		const { asFragment, getAllByTestId, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(
				within(getByTestId("PluginManager__home__featured")).getByTestId("PluginCard--ark-explorer-1"),
			);
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("selected");

		act(() => {
			fireEvent.click(
				within(getByTestId("PluginManager__home__top-rated")).getByTestId("PluginCard--ark-explorer-1"),
			);
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("selected");

		act(() => {
			fireEvent.click(
				within(getByTestId("PluginManager__home__top-utilities")).getByTestId("PluginCard--ark-explorer-1"),
			);
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("selected");
		expect(consoleSpy).toHaveBeenCalledTimes(3);
		expect(asFragment()).toMatchSnapshot();

		consoleSpy.mockRestore();
	});

	it("should select plugin on game grid", () => {
		const consoleSpy = jest.spyOn(global.console, "log").mockImplementation();

		const { asFragment, getAllByTestId, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManagerNavigationBar__game"));
			fireEvent.click(getAllByTestId("PluginCard--ark-explorer-1")[0]);
		});

		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(consoleSpy).toHaveBeenCalledWith("selected");
		expect(asFragment()).toMatchSnapshot();

		consoleSpy.mockRestore();
	});

	it("should delete plugin on home", () => {
		const consoleSpy = jest.spyOn(global.console, "log").mockImplementation();

		const { asFragment, getAllByTestId, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(within(getByTestId("PluginManager__home__featured")).getAllByTestId("dropdown__toggle")[0]);
			fireEvent.click(within(getByTestId("PluginManager__home__featured")).getByTestId("dropdown__option--1"));
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("delete");
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();

		consoleSpy.mockRestore();
	});

	it("should delete plugin on game", () => {
		const consoleSpy = jest.spyOn(global.console, "log").mockImplementation();

		const { asFragment, getAllByTestId, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManagerNavigationBar__game"));
			fireEvent.click(
				within(getByTestId("PluginManager__container--game")).getAllByTestId("dropdown__toggle")[1],
			);
			fireEvent.click(within(getByTestId("PluginManager__container--game")).getByTestId("dropdown__option--1"));
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("delete");

		act(() => {
			fireEvent.click(getByTestId("PluginManagerControls__list--icon"));
			fireEvent.click(
				within(getByTestId("PluginManager__container--game")).getAllByTestId("dropdown__toggle")[1],
			);
			fireEvent.click(within(getByTestId("PluginManager__container--game")).getByTestId("dropdown__option--1"));
		});

		expect(consoleSpy).toHaveBeenLastCalledWith("delete");
		expect(consoleSpy).toHaveBeenCalledTimes(2);
		expect(asFragment()).toMatchSnapshot();

		consoleSpy.mockRestore();
	});
});
