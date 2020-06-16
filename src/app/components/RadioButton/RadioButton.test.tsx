import { fireEvent, render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";

import { RadioButton, RadioButtonGroup, useRadioState } from "./index";

describe("RadioButtonGroup", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<RadioButtonGroup />);
		expect(getByTestId("RadioButtonGroup")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});

describe("RadioButton", () => {
	it("should render", () => {
		const isValueChecked = jest.fn((value: any) => (value === 1 ? true : false));
		const setCheckedValue = jest.fn();
		const { getAllByTestId, asFragment } = render(
			<>
				<RadioButton isValueChecked={isValueChecked} setCheckedValue={setCheckedValue} value={1}>
					Test 1
				</RadioButton>
				<RadioButton isValueChecked={isValueChecked} setCheckedValue={setCheckedValue} value={2}>
					Test 2
				</RadioButton>
				,
			</>,
		);

		const buttons = getAllByTestId("RadioButton");
		expect(buttons[0]).toHaveAttribute("aria-checked", "true");
		expect(buttons[1]).toHaveAttribute("aria-checked", "false");

		fireEvent.click(buttons[0]);
		expect(setCheckedValue).toHaveBeenCalledWith(1);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should work with useRadioState", () => {
		const { result: state } = renderHook(() => useRadioState(undefined));
		const { getAllByTestId } = render(
			<>
				<RadioButton {...state.current} value={1}>
					Test 1
				</RadioButton>
				<RadioButton {...state.current} value={2}>
					Test 2
				</RadioButton>
				,
			</>,
		);

		const buttons = getAllByTestId("RadioButton");
		expect(buttons[0]).toHaveAttribute("aria-checked", "false");
		expect(buttons[1]).toHaveAttribute("aria-checked", "false");

		act(() => {
			fireEvent.click(buttons[0]);
		});

		expect(state.current.checkedValue).toEqual(1);
	});
});
