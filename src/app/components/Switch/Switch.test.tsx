import { act, fireEvent, render } from "@testing-library/react";
import React, { useState } from "react";

import { Switch, SwitchOptions } from "./Switch";

describe("Switch", () => {
	const onChange = jest.fn();

	const options: SwitchOptions = [
		{ value: "a", label: "Option A" },
		{ value: "b", label: "Option B" },
	];

	const Wrapper = () => {
		const [value, setValue] = useState("a");

		const change = (val: string) => {
			onChange(val);
			setValue(val);
		};

		return <Switch value={value} onChange={change} options={options} />;
	};

	it("should render", () => {
		const { asFragment, getByRole, getByText } = render(<Wrapper />);

		expect(getByRole("checkbox")).toBeTruthy();
		expect(getByText("Option A")).toBeTruthy();
		expect(getByText("Option B")).toBeTruthy();
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
});
