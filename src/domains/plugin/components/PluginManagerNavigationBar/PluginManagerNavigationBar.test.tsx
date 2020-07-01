import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render } from "test-utils";

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
			expect(getByTestId(`PluginManagerNavigationBar__${navId}`)).toHaveClass("border-theme-primary-500");
		}

		expect(asFragment()).toMatchSnapshot();
	});
});
