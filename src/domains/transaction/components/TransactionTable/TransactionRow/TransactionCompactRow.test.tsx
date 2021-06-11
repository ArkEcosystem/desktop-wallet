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
		expect(getByTestId("Address__address")).toBeTruthy();
		expect(getByTestId("TransactionRowAmount")).toBeTruthy();
	});

	it("should show transaction with custom icons size", () => {
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionCompactRow transaction={TransactionFixture} iconSize="sm" />
				</tbody>
			</table>,
		);
		expect(getByTestId("TransactionRowMode")).toBeTruthy();
		expect(getByTestId("Address__address")).toBeTruthy();
		expect(getByTestId("TransactionRowAmount")).toBeTruthy();
	});
});
