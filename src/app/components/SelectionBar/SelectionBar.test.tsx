import { fireEvent, render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";

import { SelectionBar, SelectionBarOption, useSelectionState } from "./index";

describe("SelectionBar", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<SelectionBar />);
		expect(getByTestId("SelectionBar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});

describe("SelectionBarOption", () => {
	it("should render", () => {
		const isValueChecked = jest.fn((value: any) => (value === 1 ? true : false));
		const setCheckedValue = jest.fn();
		const { getAllByTestId, asFragment } = render(
			<>
				<SelectionBarOption isValueChecked={isValueChecked} setCheckedValue={setCheckedValue} value={1}>
					Test 1
				</SelectionBarOption>
				<SelectionBarOption isValueChecked={isValueChecked} setCheckedValue={setCheckedValue} value={2}>
					Test 2
				</SelectionBarOption>
				,
			</>,
		);

		const buttons = getAllByTestId("SelectionBarOption");
		expect(buttons[0]).toHaveAttribute("aria-checked", "true");
		expect(buttons[1]).toHaveAttribute("aria-checked", "false");

		fireEvent.click(buttons[0]);
		expect(setCheckedValue).toHaveBeenCalledWith(1);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should work with useSelectionState", () => {
		const { result: state } = renderHook(() => useSelectionState(undefined));
		const { getAllByTestId } = render(
			<>
				<SelectionBarOption {...state.current} value={1}>
					Test 1
				</SelectionBarOption>
				<SelectionBarOption {...state.current} value={2}>
					Test 2
				</SelectionBarOption>
				,
			</>,
		);

		const buttons = getAllByTestId("SelectionBarOption");
		expect(buttons[0]).toHaveAttribute("aria-checked", "false");
		expect(buttons[1]).toHaveAttribute("aria-checked", "false");

		act(() => {
			fireEvent.click(buttons[0]);
		});

		expect(state.current.checkedValue).toEqual(1);
	});
});
