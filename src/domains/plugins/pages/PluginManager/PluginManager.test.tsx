import { fireEvent, render, within } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

// i18n
import { translations } from "../../i18n";
import { PluginManager } from "./PluginManager";

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

	it("should open featured modal", () => {
		const { asFragment, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManager__home__featured__view-more"));
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_FEATURED_PLUGINS.TITLE);
	});

	it("should open top rated modal", () => {
		const { asFragment, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManager />
			</I18nextProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("PluginManager__home__top-rated__view-more"));
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BEST_PLUGINS.TITLE);
	});
});
