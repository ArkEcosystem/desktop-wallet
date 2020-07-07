import React from "react";
import { render } from "testing-library";

import { TransactionRowAmount } from "./TransactionRowAmount";

describe("TransactionRowAmount", () => {
	it("should show amount", () => {
		const { getByText } = render(<TransactionRowAmount amount="0.2" fee="0.1" />);
		expect(getByText("0.20000000")).toBeTruthy();
	});

	it("should show amount as currency", () => {
		const { getByText } = render(<TransactionRowAmount amount="0.2" fee="0.1" currencyRate="2.0" />);
		expect(getByText("0.40")).toBeTruthy();
	});

	it("should show total", () => {
		const { getByText } = render(<TransactionRowAmount amount="0.2" fee="0.1" isSent />);
		expect(getByText("0.30000000")).toBeTruthy();
	});

	it("should show total as currency", () => {
		const { getByText } = render(<TransactionRowAmount amount="0.2" fee="0.1" currencyRate="2.0" isSent />);
		expect(getByText("0.60")).toBeTruthy();
	});
});
