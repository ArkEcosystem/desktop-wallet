import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";
import { fireEvent, renderWithRouter } from "utils/testing-library";

import { TransactionRow } from "./TransactionRow";

describe("TransactionRow", () => {
	const fixture = { ...TransactionFixture, wallet: () => ({ currency: () => "DARK" }) };

	it("should show transaction", () => {
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionRow
						// @ts-ignore
						transaction={fixture}
					/>
				</tbody>
			</table>,
		);
		expect(getByTestId("TransactionRow__ID")).toBeTruthy();
		expect(getByTestId("TransactionRow__timestamp")).toBeTruthy();
		expect(getByTestId("TransactionRowMode")).toBeTruthy();
		expect(getByTestId("address__wallet-address")).toBeTruthy();
		expect(getByTestId("TransactionRowInfo")).toBeTruthy();
		expect(getByTestId("TransactionRowConfirmation")).toBeTruthy();
		expect(getByTestId("TransactionRowAmount")).toBeTruthy();
	});

	it("should show transaction with currency", () => {
		const { getAllByTestId } = renderWithRouter(
			<table>
				<tbody>
					{/* @ts-ignore */}
					<TransactionRow transaction={fixture} exchangeCurrency="BTC" />
				</tbody>
			</table>,
		);
		const amounts = getAllByTestId("TransactionRowAmount");
		expect(amounts).toHaveLength(2);
	});

	it("should show transaction with signature pending", () => {
		const onSign = jest.fn();
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionRow
						// @ts-ignore
						transaction={fixture}
						exchangeCurrency="BTC"
						onSign={onSign}
						isSignaturePending
					/>
				</tbody>
			</table>,
		);
		fireEvent.click(getByTestId("TransactionRow__sign"));
		expect(onSign).toHaveBeenCalled();
	});

	it("should set shadow color on mouse events", () => {
		const setState = jest.fn();
		const useStateSpy = jest.spyOn(React, "useState");

		useStateSpy.mockImplementation((state) => [state, setState]);

		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					{/* @ts-ignore */}
					<TransactionRow transaction={fixture} exchangeCurrency="BTC" />
				</tbody>
			</table>,
		);

		fireEvent.mouseEnter(getByTestId("TableRow"));
		fireEvent.mouseLeave(getByTestId("TableRow"));

		expect(setState).toHaveBeenCalledWith("--theme-color-neutral-100");
		expect(setState).toHaveBeenCalledWith("");
	});
});
