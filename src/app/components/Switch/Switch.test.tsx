import { act, fireEvent, render } from "@testing-library/react";
import React, { useState } from "react";

import { Switch, SwitchOption } from "./Switch";

describe("Switch", () => {
	const onChange = jest.fn();

	const leftOption: SwitchOption = { value: "a", label: "Option A" };
	const rightOption: SwitchOption = { value: "b", label: "Option B" };

	const Wrapper = () => {
		const [value, setValue] = useState("a");

		const change = (val: string) => {
			onChange(val);
			setValue(val);
		};

		return <Switch value={value} onChange={change} leftOption={leftOption} rightOption={rightOption} />;
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should render", () => {
		const { asFragment, getByRole, getByText } = render(<Wrapper />);

		expect(getByRole("checkbox")).toBeTruthy();
		expect(getByText("Option A")).toBeTruthy();
		expect(getByText("Option B")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render disabled", () => {
		const { asFragment, getByRole } = render(
			<Switch disabled value="a" onChange={onChange} leftOption={leftOption} rightOption={rightOption} />,
		);

		expect(getByRole("checkbox")).not.toHaveAttribute("checked", "");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should allow changing the selected option by clicking the handle", () => {
		const { getByRole } = render(<Wrapper />);

		act(() => {
			fireEvent.click(getByRole("checkbox"));
		});

		expect(onChange).toBeCalledWith("b");
		expect(getByRole("checkbox")).toBeChecked();

		act(() => {
			fireEvent.click(getByRole("checkbox"));
		});

		expect(onChange).toBeCalledWith("a");
		expect(getByRole("checkbox")).not.toBeChecked();
	});

	it("should allow changing the selected option by clicking the option text", () => {
		const { getByRole, getByText } = render(<Wrapper />);

		act(() => {
			fireEvent.click(getByText("Option B"));
		});

		expect(onChange).toBeCalledWith("b");
		expect(getByRole("checkbox")).toBeChecked();

		act(() => {
			fireEvent.click(getByText("Option A"));
		});

		expect(onChange).toBeCalledWith("a");
		expect(getByRole("checkbox")).not.toBeChecked();
	});

	it("should not select option by clicking the option text when disabled", () => {
		const { getByRole, getByText } = render(
			<Switch disabled value="a" onChange={onChange} leftOption={leftOption} rightOption={rightOption} />,
		);

		expect(getByRole("checkbox")).not.toBeChecked();

		act(() => {
			fireEvent.click(getByText("Option B"));
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(getByRole("checkbox")).not.toBeChecked();
	});
});
