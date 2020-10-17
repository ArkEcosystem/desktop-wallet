import { InputFee } from "domains/transaction/components/InputFee";
import React from "react";
import { fireEvent, render, waitFor } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";

let value: { display: string; value: string };
let min: string;
let max: string;
let avg: string;
let step: number;

describe("InputFee", () => {
	beforeEach(() => {
		value = (2 * 1e8).toFixed(0);
		min = (1 * 1e8).toFixed(0);
		max = (10 * 1e8).toFixed(0);
		avg = (1.355 * 1e8).toFixed(0);
		step = 0.001;
	});

	it("should render", () => {
		const { asFragment } = render(
			<InputFee min={min} max={max} avg={avg} defaultValue={value} value={value} step={step} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee if value property changes", () => {
		const { asFragment, getByTestId, rerender } = render(
			<InputFee min={min} max={max} avg={avg} defaultValue={value} value={value} step={step} />,
		);

		rerender(<InputFee min={min} max={max} avg={avg} defaultValue={value} value={"100000000"} step={step} />);

		waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("1");
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on min", () => {
		const onChange = jest.fn();

		const { asFragment, getByText } = render(
			<InputFee
				min={min}
				max={max}
				avg={avg}
				defaultValue={value}
				value={value}
				step={step}
				onChange={onChange}
			/>,
		);

		fireEvent.click(getByText(transactionTranslations.FEES.MIN));

		waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("1");
			expect(onChange).toHaveBeenCalledWith({ display: "1", value: "100000000" });
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on avg", () => {
		const onChange = jest.fn();

		const { asFragment, getByText } = render(
			<InputFee min={min} max={max} avg={avg} defaultValue={value} step={step} onChange={onChange} />,
		);

		fireEvent.click(getByText(transactionTranslations.FEES.AVERAGE));

		waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("1.354");
			expect(onChange).toHaveBeenCalledWith({ display: "1.354", value: "135400000" });
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on max", () => {
		const onChange = jest.fn();

		const { asFragment, getByText } = render(
			<InputFee min={min} max={max} avg={avg} defaultValue={value} step={step} onChange={onChange} />,
		);

		fireEvent.click(getByText(transactionTranslations.FEES.MAX));

		waitFor(() => {
			expect(getByTestId("InputCurrency")).toHaveValue("10");
			expect(onChange).toHaveBeenCalledWith({ display: "10", value: "1000000000" });
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
