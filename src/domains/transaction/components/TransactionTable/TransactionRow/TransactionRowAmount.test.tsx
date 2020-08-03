import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { TransactionRowAmount } from "./TransactionRowAmount";

describe("TransactionRowAmount", () => {
	it("should show amount", () => {
		const { getByText } = render(
			<TransactionRowAmount transaction={{ ...TransactionFixture, isSent: () => false }} />,
		);
		expect(getByText("100.00000000")).toBeTruthy();
	});

	it("should show amount as currency", () => {
		const { getByText } = render(<TransactionRowAmount transaction={TransactionFixture} currencyRate="2.0" />);
		expect(getByText("242.00")).toBeTruthy();
	});

	it("should show total", () => {
		const { getByText } = render(<TransactionRowAmount transaction={TransactionFixture} />);
		expect(getByText("121.00000000")).toBeTruthy();
	});

	it("should show total as currency", () => {
		const { getByText } = render(<TransactionRowAmount transaction={TransactionFixture} currencyRate="2.0" />);
		expect(getByText("242.00")).toBeTruthy();
	});
});
