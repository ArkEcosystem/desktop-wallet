import React, { useState } from "react";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

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

		expect(onChange).toHaveBeenCalledWith({ display: "123", value: "12300000000" });
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

		expect(onChange).toHaveBeenCalledWith({ display: "123", value: "12300" });
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

		expect(onChange).toHaveBeenCalledWith({ display: "123", value: "123" });
	});

	it("should format with a default value", () => {
		const { getByTestId } = render(<InputCurrency value=".01" />);
		const input = getByTestId("InputCurrency");

		expect(input).toHaveValue("0.01");
	});

	it("should fallback on convert value", () => {
		const { getByTestId, rerender } = render(<InputCurrency value=".01" />);
		const input = getByTestId("InputCurrency");

		expect(input).toHaveValue("0.01");

		rerender(<InputCurrency value={undefined} />);

		waitFor(() => expect(input).toHaveValue("0"));
	});

	it("should work with a controlled value", () => {
		const Component = () => {
			const [value, setValue] = useState("0.04");
			return <InputCurrency value={value} onChange={setValue} />;
		};
		const { getByTestId } = render(<Component />);
		const input = getByTestId("InputCurrency");

		expect(input).toHaveValue("0.04");

		act(() => {
			fireEvent.input(input, {
				target: {
					value: "1.23",
				},
			});
		});

		waitFor(() => expect(input).toHaveValue("1.23"));
	});

	it("should render with a custom element", async () => {
		const CustomInput = React.forwardRef((_, ref) => <input placeholder="Custom Input" ref={ref} />);
		CustomInput.displayName = "CustomInput";
		const { getByPlaceholderText } = render(<InputCurrency as={CustomInput} />);

		const input = getByPlaceholderText("Custom Input");

		fireEvent.input(input, {
			target: {
				value: "1.2",
			},
		});

		await waitFor(() => expect(input).toHaveValue("1.2"));
	});
});
