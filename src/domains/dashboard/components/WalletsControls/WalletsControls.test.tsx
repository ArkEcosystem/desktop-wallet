import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render } from "testing-library";

import { WalletsControls } from "./WalletsControls";

describe("WalletsControls", () => {
	const filterProperties = {
		isFilterChanged: false,
		networks: [],
		selectedNetworkIds: [],
		useTestNetworks: true,
		viewType: "list",
		walletsDisplayType: "all",
	};

	it("should render", () => {
		const { container } = render(<WalletsControls filterProperties={filterProperties as any} />);

		expect(container).toMatchSnapshot();
	});

	it("should render with networks selection", () => {
		const { container } = render(<WalletsControls filterProperties={filterProperties as any} />);

		expect(container).toMatchSnapshot();
	});

	it("should emit event for grid view selection and call callback if provided", () => {
		const function_ = jest.fn();
		const { getByTestId } = render(
			<WalletsControls filterProperties={filterProperties as any} onSelectGridView={function_} />,
		);
		const toggle = getByTestId("LayoutControls__grid--icon");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(function_).toBeCalled();
	});

	it("should ignore event emition for grid view if callback not provided", () => {
		const function_ = jest.fn();
		const { getByTestId } = render(<WalletsControls filterProperties={filterProperties as any} />);
		const toggle = getByTestId("LayoutControls__grid--icon");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(function_).not.toBeCalled();
	});

	it("should ignore grid event if already on grid view", () => {
		const function_ = jest.fn();
		const { getByTestId } = render(
			<WalletsControls
				filterProperties={{ ...filterProperties, viewType: "grid" } as any}
				onSelectGridView={function_}
			/>,
		);
		const toggle = getByTestId("LayoutControls__grid--icon");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(function_).not.toBeCalled();
	});

	it("should emit event for list view selection and call callback if provided", () => {
		const function_ = jest.fn();
		const { getByTestId } = render(
			<WalletsControls
				filterProperties={{ ...filterProperties, viewType: "grid" } as any}
				onSelectListView={function_}
			/>,
		);
		const toggle = getByTestId("LayoutControls__list--icon");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(function_).toBeCalled();
	});

	it("should ignore event emition for list view if callback not provided", () => {
		const function_ = jest.fn();
		const { getByTestId } = render(<WalletsControls filterProperties={filterProperties as any} />);
		const toggle = getByTestId("LayoutControls__list--icon");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(function_).not.toBeCalled();
	});

	it("should ignore list event if already on grid view", () => {
		const function_ = jest.fn();
		const { getByTestId } = render(<WalletsControls viewType="list" filterProperties={filterProperties as any} />);
		const toggle = getByTestId("LayoutControls__list--icon");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(function_).not.toBeCalled();
	});
});
