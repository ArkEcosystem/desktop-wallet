import { fireEvent, render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";

import { PluginManagerControls } from "./PluginManagerControls";

describe("PluginManagerControls", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(<PluginManagerControls />);

		expect(getByTestId("PluginManagerControls")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle between list and grid", () => {
		const { result } = renderHook(() => {
			const [viewType, setViewType] = React.useState("grid");

			return {
				viewType,
				setViewType,
			};
		});

		const { asFragment, getByTestId, rerender } = render(
			<PluginManagerControls
				selectedViewType={result.current.viewType}
				onSelectListView={() => result.current.setViewType("list")}
				onSelectGridView={() => result.current.setViewType("grid")}
			/>,
		);

		const gridIcon = getByTestId("PluginManagerControls__grid--icon");
		const listIcon = getByTestId("PluginManagerControls__list--icon");

		expect(gridIcon).toHaveClass("text-theme-danger-300");
		expect(listIcon).not.toHaveClass("text-theme-danger-300");

		act(() => {
			fireEvent.click(listIcon);
		});

		rerender(
			<PluginManagerControls
				selectedViewType={result.current.viewType}
				onSelectListView={() => result.current.setViewType("list")}
				onSelectGridView={() => result.current.setViewType("grid")}
			/>,
		);

		expect(gridIcon).not.toHaveClass("text-theme-danger-300");
		expect(listIcon).toHaveClass("text-theme-danger-300");

		act(() => {
			fireEvent.click(gridIcon);
		});

		rerender(
			<PluginManagerControls
				selectedViewType={result.current.viewType}
				onSelectListView={() => result.current.setViewType("list")}
				onSelectGridView={() => result.current.setViewType("grid")}
			/>,
		);

		expect(gridIcon).toHaveClass("text-theme-danger-300");
		expect(listIcon).not.toHaveClass("text-theme-danger-300");

		expect(asFragment()).toMatchSnapshot();
	});
});
