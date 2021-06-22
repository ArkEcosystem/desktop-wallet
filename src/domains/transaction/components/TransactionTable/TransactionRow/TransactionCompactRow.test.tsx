import { screen } from "@testing-library/react";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";
import { renderWithRouter } from "utils/testing-library";

import { TransactionCompactRow } from "./TransactionCompactRow";

describe("TransactionCompactRow", () => {
	it("should show transaction", () => {
		renderWithRouter(
			<table>
				<tbody>
					<TransactionCompactRow transaction={TransactionFixture} />
				</tbody>
			</table>,
		);

		expect(screen.getByTestId("TransactionRowMode")).toBeTruthy();
		expect(screen.getByTestId("Address__address")).toBeTruthy();
		expect(screen.getByTestId("AmountCrypto")).toBeTruthy();
	});

	it("should render loading state", () => {
		renderWithRouter(
			<table>
				<tbody>
					<TransactionCompactRow transaction={TransactionFixture} isLoading={true} />
				</tbody>
			</table>,
		);

		expect(screen.queryByTestId("TransactionRowMode")).not.toBeInTheDocument();
		expect(screen.queryByTestId("Address__address")).not.toBeInTheDocument();
		expect(screen.queryByTestId("AmountCrypto")).not.toBeInTheDocument();
	});
});
