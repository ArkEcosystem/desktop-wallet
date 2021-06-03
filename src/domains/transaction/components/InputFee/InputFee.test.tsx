import { InputFee } from "domains/transaction/components/InputFee";
import React, { useState } from "react";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";

let defaultProps: any = {};

describe("InputFee", () => {
	beforeEach(() => {
		defaultProps = {
			value: "0.3",
			min: "0.006",
			max: "0.5",
			avg: "0.456",
			step: 0.001,
			showFeeOptions: true,
			onChange: jest.fn(),
		};
	});

	it("should render", () => {
		const { asFragment, getByTestId } = render(<InputFee {...defaultProps} />);

		expect(getByTestId("InputCurrency")).toHaveValue(defaultProps.value);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee if value property changes", async () => {
		const { asFragment, getByTestId, rerender } = render(<InputFee {...defaultProps} />);

		expect(getByTestId("InputCurrency")).toHaveValue(defaultProps.value);

		rerender(<InputFee {...defaultProps} value={"0.0123"} />);

		await waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("0.0123");
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on min", async () => {
		const onChange = jest.fn();

		const Wrapper = () => {
			const [value, setValue] = useState(defaultProps.value);

			const handleChange = (val: string) => {
				setValue(val);
				onChange(val);
			};

			return <InputFee {...defaultProps} value={value} onChange={handleChange} />;
		};

		const { asFragment, getByText, getByTestId } = render(<Wrapper />);

		expect(getByTestId("InputCurrency")).toHaveValue(defaultProps.value);

		act(() => {
			fireEvent.click(getByText(transactionTranslations.FEES.SLOW));
		});

		await waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue(defaultProps.min);
			expect(onChange).toHaveBeenCalledWith(defaultProps.min);
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on avg", async () => {
		const onChange = jest.fn();

		const Wrapper = () => {
			const [value, setValue] = useState(defaultProps.value);

			const handleChange = (val: string) => {
				setValue(val);
				onChange(val);
			};

			return <InputFee {...defaultProps} value={value} onChange={handleChange} />;
		};

		const { asFragment, getByText, getByTestId } = render(<Wrapper />);

		expect(getByTestId("InputCurrency")).toHaveValue(defaultProps.value);

		act(() => {
			fireEvent.click(getByText(transactionTranslations.FEES.AVERAGE));
		});

		await waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue(defaultProps.avg);
			expect(onChange).toHaveBeenCalledWith(defaultProps.avg);
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on max", async () => {
		const onChange = jest.fn();

		const Wrapper = () => {
			const [value, setValue] = useState(defaultProps.value);

			const handleChange = (val: string) => {
				setValue(val);
				onChange(val);
			};

			return <InputFee {...defaultProps} value={value} onChange={handleChange} />;
		};

		const { asFragment, getByText, getByTestId } = render(<Wrapper />);

		act(() => {
			fireEvent.click(getByText(transactionTranslations.FEES.FAST));
		});

		await waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue(defaultProps.max);
			expect(onChange).toHaveBeenCalledWith(defaultProps.max);
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
