import React from "react";
import { renderWithRouter } from "utils/testing-library";

import { Transaction } from "../TransactionTable.models";
import { TransactionCompactRow } from "./TransactionCompactRow";

describe("TransactionCompactRow", () => {
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
					<TransactionCompactRow transaction={transaction} />
				</tbody>
			</table>,
		);
		expect(getByTestId("TransactionRowMode")).toBeTruthy();
		expect(getByTestId("address__wallet-address")).toBeTruthy();
		expect(getByTestId("TransactionRowAmount")).toBeTruthy();
	});
});
