import { InputFee } from "domains/transaction/components/InputFee";
import React from "react";
import { fireEvent, render } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";

let value: string;
let min: string;
let max: string;
let avg: string;

describe("InputFee", () => {
	beforeEach(() => {
		value = (5 * 1e8).toFixed(0);
		min = (1 * 1e8).toFixed(0);
		max = (10 * 1e8).toFixed(0);
		avg = (1.354 * 1e8).toFixed(0);
	});

	it("should render", () => {
		const { asFragment } = render(<InputFee min={min} max={max} avg={avg} defaultValue={value} step={0.01} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee if value property changes", () => {
		const { asFragment, getByTestId, rerender } = render(
			<InputFee min={min} max={max} avg={avg} defaultValue={value} value={value} step={0.01} />,
		);

		rerender(
			<InputFee min={min} max={max} avg={avg} defaultValue={value} value={(1 * 1e8).toFixed(0)} step={0.01} />,
		);

		expect(getByTestId("InputCurrency")).toHaveValue("1");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on min", () => {
		const onChange = jest.fn();

		const { asFragment, getByText } = render(
			<InputFee min={min} max={max} avg={avg} defaultValue={value} step={0.01} onChange={onChange} />,
		);

		fireEvent.click(getByText(transactionTranslations.FEES.MIN));

		expect(onChange).toHaveBeenCalledWith({ value: min });
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on avg", () => {
		const onChange = jest.fn();

		const { asFragment, getByText } = render(
			<InputFee min={min} max={max} avg={avg} defaultValue={value} step={0.01} onChange={onChange} />,
		);

		fireEvent.click(getByText(transactionTranslations.FEES.AVERAGE));

		expect(onChange).toHaveBeenCalledWith({ value: avg });
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update fee when clicking on max", () => {
		const onChange = jest.fn();

		const { asFragment, getByText } = render(
			<InputFee min={min} max={max} avg={avg} defaultValue={value} step={0.01} onChange={onChange} />,
		);

		fireEvent.click(getByText(transactionTranslations.FEES.MAX));

		expect(onChange).toHaveBeenCalledWith({ value: max });
		expect(asFragment()).toMatchSnapshot();
	});
});
