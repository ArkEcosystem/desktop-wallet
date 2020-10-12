import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render } from "testing-library";

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

		const gridIcon = getByTestId("LayoutControls__grid--icon");
		const listIcon = getByTestId("LayoutControls__list--icon");

		act(() => {
			fireEvent.click(listIcon);
		});

		expect(result.current.viewType).toBe("list");

		rerender(
			<PluginManagerControls
				selectedViewType={result.current.viewType}
				onSelectListView={() => result.current.setViewType("list")}
				onSelectGridView={() => result.current.setViewType("grid")}
			/>,
		);

		expect(result.current.viewType).toBe("list");

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

		expect(result.current.viewType).toBe("grid");

		expect(asFragment()).toMatchSnapshot();
	});
});
