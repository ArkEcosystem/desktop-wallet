import React from "react";
import { fireEvent, renderWithRouter } from "utils/testing-library";

import { Transaction } from "../TransactionTable.models";
import { TransactionRow } from "./TransactionRow";

describe("TransactionRow", () => {
	const transaction: Transaction = {
		id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		confirmations: "10",
		timestamp: "17 Mar 2020 22:02:10",
		type: "transfer",
		sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		amount: "100",
		fee: "21",
		isSent: true,
	};

	it("should show transaction", () => {
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionRow transaction={transaction} />
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
					<TransactionRow transaction={transaction} currencyRate="2" />
				</tbody>
			</table>,
		);
		const amounts = getAllByTestId("TransactionRowAmount");
		expect(amounts).toHaveLength(2);
	});

	it("should show transaction with signature pending", () => {
		const transaction2 = {
			...transaction,
			type: "transfer",
			isSignaturePending: true,
		};
		const onSign = jest.fn();
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionRow transaction={transaction2} currencyRate="2" onSign={onSign} />
				</tbody>
			</table>,
		);
		fireEvent.click(getByTestId("TransactionRow__sign"));
		expect(onSign).toHaveBeenCalled();
	});
});
