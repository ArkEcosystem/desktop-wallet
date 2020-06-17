import { fireEvent, render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";

import { SelectionBar, SelectionBarGroup, useRadioState } from "./index";

describe("SelectionBarGroup", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<SelectionBarGroup />);
		expect(getByTestId("SelectionBarGroup")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});

describe("SelectionBar", () => {
	it("should render", () => {
		const isValueChecked = jest.fn((value: any) => (value === 1 ? true : false));
		const setCheckedValue = jest.fn();
		const { getAllByTestId, asFragment } = render(
			<>
				<SelectionBar isValueChecked={isValueChecked} setCheckedValue={setCheckedValue} value={1}>
					Test 1
				</SelectionBar>
				<SelectionBar isValueChecked={isValueChecked} setCheckedValue={setCheckedValue} value={2}>
					Test 2
				</SelectionBar>
				,
			</>,
		);

		const buttons = getAllByTestId("SelectionBar");
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
				<SelectionBar {...state.current} value={1}>
					Test 1
				</SelectionBar>
				<SelectionBar {...state.current} value={2}>
					Test 2
				</SelectionBar>
				,
			</>,
		);

		const buttons = getAllByTestId("SelectionBar");
		expect(buttons[0]).toHaveAttribute("aria-checked", "false");
		expect(buttons[1]).toHaveAttribute("aria-checked", "false");

		act(() => {
			fireEvent.click(buttons[0]);
		});

		expect(state.current.checkedValue).toEqual(1);
	});
});
