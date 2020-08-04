import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";
import { renderWithRouter } from "utils/testing-library";

import { TransactionCompactRow } from "./TransactionCompactRow";

describe("TransactionCompactRow", () => {
	it("should show transaction", () => {
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionCompactRow transaction={TransactionFixture} />
				</tbody>
			</table>,
		);
		expect(getByTestId("TransactionRowMode")).toBeTruthy();
		expect(getByTestId("address__wallet-address")).toBeTruthy();
		expect(getByTestId("TransactionRowAmount")).toBeTruthy();
	});
});
