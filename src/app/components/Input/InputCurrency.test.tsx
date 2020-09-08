import React, { useState } from "react";
import { act, fireEvent, render, screen } from "testing-library";

import { InputCurrency } from "./InputCurrency";

describe("InputCurrency", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<InputCurrency />);
		expect(getByTestId("InputCurrency")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit formatted value", () => {
		const onChange = jest.fn();
		const { getByTestId } = render(<InputCurrency onChange={onChange} />);
		const input = getByTestId("InputCurrency");

		act(() => {
			fireEvent.input(input, {
				target: {
					value: "123",
				},
			});
		});

		expect(onChange).toHaveBeenCalledWith("12300000000");
	});

	it("should accept a custom magnitude", () => {
		const onChange = jest.fn();
		const { getByTestId } = render(<InputCurrency magnitude={2} onChange={onChange} />);
		const input = getByTestId("InputCurrency");

		act(() => {
			fireEvent.input(input, {
				target: {
					value: "123",
				},
			});
		});

		expect(onChange).toHaveBeenCalledWith("12300");
	});

	it("should not allow letters", () => {
		const onChange = jest.fn();
		const { getByTestId } = render(<InputCurrency magnitude={0} onChange={onChange} />);
		const input = getByTestId("InputCurrency");

		act(() => {
			fireEvent.input(input, {
				target: {
					value: "abc123",
				},
			});
		});

		expect(onChange).toHaveBeenCalledWith("123");
	});

	it("should format with a default value", () => {
		const { getByTestId } = render(<InputCurrency value=".01" />);
		const input = getByTestId("InputCurrency");

		expect(input).toHaveValue("0.01");
	});

	it("should work with a controlled value", () => {
		const Component = () => {
			const [value, setValue] = useState("0.04");
			return <InputCurrency value={value} onChange={setValue} />;
		};
		render(<Component />);
		const input = screen.getByRole("textbox");

		expect(input).toHaveValue("0.04");

		act(() => {
			fireEvent.input(input, {
				target: {
					value: "abc1.2",
				},
			});
		});

		// TODO: Should not fail
		// As the output should match the input for a controlled case
		expect(input).toHaveValue("1.2");
	});
});
