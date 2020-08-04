import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";
import { fireEvent, renderWithRouter } from "utils/testing-library";

import { TransactionRow } from "./TransactionRow";

describe("TransactionRow", () => {
	it("should show transaction", () => {
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionRow transaction={TransactionFixture} />
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
					<TransactionRow transaction={TransactionFixture} currencyRate="2" />
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
						transaction={TransactionFixture}
						currencyRate="2"
						onSign={onSign}
						isSignaturePending
					/>
				</tbody>
			</table>,
		);
		fireEvent.click(getByTestId("TransactionRow__sign"));
		expect(onSign).toHaveBeenCalled();
	});
});
