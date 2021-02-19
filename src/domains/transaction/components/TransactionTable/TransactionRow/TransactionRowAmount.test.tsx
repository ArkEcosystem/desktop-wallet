import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { TransactionRowAmount } from "./TransactionRowAmount";

describe("TransactionRowAmount", () => {
	it("should show total", () => {
		// @ts-ignore
		const { getByText } = render(
			<TransactionRowAmount transaction={{ ...TransactionFixture, wallet: () => ({ currency: () => "ARK" }) }} />,
		);
		expect(getByText("- 121 ARK")).toBeTruthy();
	});

	it("should show total as currency", () => {
		const { getByText } = render(
			<TransactionRowAmount
				transaction={{ ...TransactionFixture, wallet: () => ({ currency: () => "ARK" }) }}
				exchangeCurrency="BTC"
			/>,
		);
		expect(getByText("0 BTC")).toBeTruthy();
	});

	it("should show as received", () => {
		const { container, getByText } = render(
			<TransactionRowAmount
				transaction={{ ...TransactionFixture, wallet: () => ({ currency: () => "ARK" }), isSent: () => false }}
			/>,
		);
		expect(getByText("+ 121 ARK")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});
