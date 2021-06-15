import { act, renderHook } from "@testing-library/react-hooks";
import { PluginProviders } from "app/PluginProviders";
import { translations as pluginTranslations } from "domains/plugin/i18n";
import React from "react";
import { fireEvent, render } from "utils/testing-library";

import { PluginManagerNavigationBar } from "./PluginManagerNavigationBar";

let menu: any[];

describe("PluginManagerNavigationBar", () => {
	beforeAll(() => {
		menu = ["latest", "gaming", "utility", "exchange", "other"].map((name: string) => ({
			title: pluginTranslations.PAGE_PLUGIN_MANAGER.VIEW[name.toUpperCase()],
			name,
		}));
	});

	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<PluginProviders>
				<PluginManagerNavigationBar menu={menu} />
			</PluginProviders>,
		);

		expect(getByTestId("PluginManagerNavigationBar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update selected", () => {
		const { result } = renderHook(() => {
			const [currentView, setCurrentView] = React.useState("latest");

			return {
				currentView,
				setCurrentView,
			};
		});

		const { asFragment, getByTestId, rerender } = render(
			<PluginProviders>
				<PluginManagerNavigationBar
					menu={menu}
					selectedView={result.current.currentView}
					onChange={result.current.setCurrentView}
				/>
				,
			</PluginProviders>,
		);

		const navIds = ["gaming", "utility", "exchange", "other", "my-plugins", "latest"];

		for (const navId of navIds) {
			const navItem = getByTestId(`tabs__tab-button-${navId}`);

			act(() => {
				fireEvent.click(navItem);
			});

			rerender(
				<PluginProviders>
					<PluginManagerNavigationBar
						menu={menu}
						selectedView={result.current.currentView}
						onChange={result.current.setCurrentView}
					/>
					,
				</PluginProviders>,
			);

			expect(result.current.currentView).toBe(navId);
			expect(getByTestId(`tabs__tab-button-${navId}`)).toHaveAttribute("aria-selected", "true");
		}

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show installed plugins count", () => {
		const { getByTestId } = render(
			<PluginProviders>
				<PluginManagerNavigationBar menu={menu} selectedView="" installedPluginsCount={8} />,
			</PluginProviders>,
		);

		expect(getByTestId("tabs__tab-button-my-plugins-count")).toHaveTextContent("8");
	});
});
