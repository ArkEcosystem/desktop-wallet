import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render } from "testing-library";

import { PluginManagerNavigationBar } from "./PluginManagerNavigationBar";

describe("PluginManagerNavigationBar", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(<PluginManagerNavigationBar />);

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
			<PluginManagerNavigationBar
				selected={result.current.currentView}
				onChange={result.current.setCurrentView}
			/>,
		);

		const navIds = ["game", "utility", "themes", "other", "my-plugins", "home"];

		for (const navId of navIds) {
			const navItem = getByTestId(`PluginManagerNavigationBar__${navId}`);

			act(() => {
				fireEvent.click(navItem);
			});

			rerender(
				<PluginManagerNavigationBar
					selected={result.current.currentView}
					onChange={result.current.setCurrentView}
				/>,
			);

			expect(result.current.currentView).toBe(navId);
			expect(getByTestId(`PluginManagerNavigationBar__${navId}`)).toHaveClass("active");
		}

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show installed plugins count", () => {
		const { asFragment, getByTestId } = render(
			<PluginManagerNavigationBar selected="" installedPluginsCount={8} />,
		);

		expect(getByTestId("PluginManagerNavigationBar__my-plugins__count")).toHaveTextContent("8");
	});
});
