import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render } from "testing-library";

import { ButtonGroup, ButtonGroupOption } from "./ButtonGroup";
import { useSelectionState } from "./useSelectionState";

describe("ButtonGroup", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<ButtonGroup />);
		expect(getByTestId("ButtonGroup")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});

describe("ButtonGroupOption", () => {
	it("should render", () => {
		const isValueChecked = jest.fn((value: any) => (value === 1 ? true : false));
		const setCheckedValue = jest.fn();
		const { getAllByTestId, asFragment } = render(
			<>
				<ButtonGroupOption isValueChecked={isValueChecked} setCheckedValue={setCheckedValue} value={1}>
					Test 1
				</ButtonGroupOption>
				<ButtonGroupOption isValueChecked={isValueChecked} setCheckedValue={setCheckedValue} value={2}>
					Test 2
				</ButtonGroupOption>
				,
			</>,
		);

		const buttons = getAllByTestId("ButtonGroupOption");
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
				<ButtonGroupOption {...state.current} value={1}>
					Test 1
				</ButtonGroupOption>
				<ButtonGroupOption {...state.current} value={2}>
					Test 2
				</ButtonGroupOption>
				,
			</>,
		);

		const buttons = getAllByTestId("ButtonGroupOption");
		expect(buttons[0]).toHaveAttribute("aria-checked", "false");
		expect(buttons[1]).toHaveAttribute("aria-checked", "false");

		act(() => {
			fireEvent.click(buttons[0]);
		});

		expect(state.current.checkedValue).toEqual(1);
	});
});
