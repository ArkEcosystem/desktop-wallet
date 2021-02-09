import { InputFee } from "domains/transaction/components/InputFee";
import React from "react";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";

let value: { display: string; value: string };
let min: string;
let max: string;
let avg: string;
let step: number;

let defaultProps = {};

describe("InputFee", () => {
	beforeEach(() => {
		defaultProps = {
			value: (2 * 1e8).toFixed(0),
			min: (1 * 1e8).toFixed(0),
			max: (10 * 1e8).toFixed(0),
			avg: (1.355 * 1e8).toFixed(0),
			step: 0.001,
			showFeeOptions: true,
		};
	});

	it("should render", () => {
		const { asFragment, getByTestId } = render(<InputFee {...defaultProps} defaultValue={defaultProps.value} />);

		expect(getByTestId("InputCurrency")).toHaveValue("2");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee if value property changes", async () => {
		const { asFragment, getByTestId, rerender } = render(
			<InputFee {...defaultProps} defaultValue={defaultProps.value} />,
		);

		expect(getByTestId("InputCurrency")).toHaveValue("2");

		rerender(<InputFee {...defaultProps} defaultValue={defaultProps.value} value={"100000000"} />);

		await waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("1");
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on min", async () => {
		const onChange = jest.fn();

		const { asFragment, getByText, getByTestId } = render(
			<InputFee {...defaultProps} defaultValue={defaultProps.value} onChange={onChange} />,
		);
		expect(getByTestId("InputCurrency")).toHaveValue("2");

		act(() => {
			fireEvent.click(getByText(transactionTranslations.FEES.SLOW));
		});

		await waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("1");
			expect(onChange).toHaveBeenCalledWith({ display: "1", value: "100000000" });
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on avg", async () => {
		const onChange = jest.fn();

		const { asFragment, getByText, getByTestId } = render(
			<InputFee {...defaultProps} defaultValue={defaultProps.value} onChange={onChange} />,
		);

		act(() => {
			fireEvent.click(getByText(transactionTranslations.FEES.AVERAGE));
		});

		await waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("1.355");
			expect(onChange).toHaveBeenCalledWith({ display: "1.355", value: "135500000" });
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on max", async () => {
		const onChange = jest.fn();

		const { asFragment, getByText, getByTestId } = render(
			<InputFee {...defaultProps} defaultValue={defaultProps.value} onChange={onChange} />,
		);

		act(() => {
			fireEvent.click(getByText(transactionTranslations.FEES.FAST));
		});

		await waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("10");
			expect(onChange).toHaveBeenCalledWith({ display: "10", value: "1000000000" });
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
