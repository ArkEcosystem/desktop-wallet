import { act as hookAct, renderHook } from "@testing-library/react-hooks";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { act, fireEvent, render, waitFor } from "testing-library";

import { FormField } from "../Form";
import { InputRange } from "./InputRange";

const properties = {
	value: "5",
	max: 10,
	min: 0,
	step: 1,
	onChange: jest.fn(),
};

describe("InputRange", () => {
	it("should render with default value", async () => {
		const { asFragment, getByTestId } = render(<InputRange {...properties} />);

		await waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("5");
			expect(getByTestId("Range__thumb")).toHaveAttribute("aria-valuenow", "5");
		});

		expect(asFragment()).toMatchSnapshot();
		expect(properties.onChange).not.toHaveBeenCalled();
	});

	it("should render when disabled", async () => {
		const { asFragment, getByTestId } = render(<InputRange {...properties} disabled={true} />);

		await waitFor(() => expect(() => getByTestId("Range")).toThrowError(/Unable to find/));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update the range when changing the input", () => {
		const onChange = jest.fn();

		// wrap InputRange as it does not keep the value state internally
		const Wrapper = () => {
			const [value, setValue] = useState(properties.value);

			const handleChange = (value_: string) => {
				setValue(value_);
				onChange(value_);
			};

			return <InputRange {...properties} value={value} onChange={handleChange} />;
		};

		const { getByTestId } = render(<Wrapper />);
		const input = getByTestId("InputCurrency");

		act(() => {
			fireEvent.change(input, { target: { value: "9" } });
		});

		expect(getByTestId("Range__thumb")).toHaveAttribute("aria-valuenow", "9");
		expect(input).toHaveValue("9");
		expect(onChange).toHaveBeenCalledWith("9");
	});

	it("should update the input when changing the range", () => {
		const { getByTestId } = render(<InputRange {...properties} />);
		const thumb = getByTestId("Range__thumb");

		fireEvent.keyDown(thumb, { key: "ArrowRight", code: "ArrowRight" });

		waitFor(() => expect(thumb).toHaveAttribute("aria-valuenow", "6"));
		waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("6"));
		expect(properties.onChange).toHaveBeenCalledWith("6");
	});

	it("should not allow a value greater than the maximum", () => {
		const { getByTestId } = render(<InputRange {...properties} />);
		const input = getByTestId("InputCurrency");

		fireEvent.change(input, { target: { value: "11" } });

		waitFor(() => expect(input).toHaveValue("10"));
		expect(getByTestId("Range__thumb")).not.toHaveAttribute("aria-valuenow", "11");
		expect(properties.onChange).toHaveBeenCalledWith("11");
	});

	it("should track background min value", async () => {
		const properties_ = { ...properties, min: 4, value: "2", step: 3 };
		const { getByTestId, asFragment } = render(<InputRange {...properties_} />);
		await waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("2");
			expect(getByTestId("Range__thumb")).toHaveAttribute("aria-valuenow", "2");
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render invalid", async () => {
		const { result: form } = renderHook(() => useForm());
		const properties_ = { ...properties, min: 4, value: "2", step: 3 };
		hookAct(() => {
			form.current.setError("test", { type: "fail", message: "test" });
		});

		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<FormField name="test">
					<InputRange {...properties_} />
				</FormField>
			</FormProvider>,
		);

		await waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("2");
			expect(getByTestId("Range__thumb")).toHaveAttribute("aria-valuenow", "2");
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
