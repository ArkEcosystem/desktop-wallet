import { fireEvent, render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { PluginManagerNavigationBar } from "./PluginManagerNavigationBar";

describe("PluginManagerNavigationBar", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManagerNavigationBar />
			</I18nextProvider>,
		);

		expect(getByTestId("PluginManagerNavigationBar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update selected", () => {
		const { result } = renderHook(() => {
			const [currentView, setCurrentView] = React.useState("home");

			return {
				currentView,
				setCurrentView,
			};
		});

		const { asFragment, getByTestId, rerender } = render(
			<I18nextProvider i18n={i18n}>
				<PluginManagerNavigationBar
					selected={result.current.currentView}
					onChange={result.current.setCurrentView}
				/>
			</I18nextProvider>,
		);

		const navIds = ["game", "utility", "themes", "other", "my-plugins", "home"];

		for (const navId of navIds) {
			const navItem = getByTestId(`PluginManagerNavigationBar__${navId}`);

			act(() => {
				fireEvent.click(navItem);
			});

			rerender(
				<I18nextProvider i18n={i18n}>
					<PluginManagerNavigationBar
						selected={result.current.currentView}
						onChange={result.current.setCurrentView}
					/>
				</I18nextProvider>,
			);

			expect(result.current.currentView).toBe(navId);
			expect(getByTestId(`PluginManagerNavigationBar__${navId}`)).toHaveClass("border-theme-primary-500");
		}

		expect(asFragment()).toMatchSnapshot();
	});
});
