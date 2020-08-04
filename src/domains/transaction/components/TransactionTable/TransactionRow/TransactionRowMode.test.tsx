import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { TransactionRowMode } from "./TransactionRowMode";

describe("TransactionRowMode", () => {
	it("should show sent icon", () => {
		const { getByTestId } = render(<TransactionRowMode transaction={TransactionFixture} />);
		expect(getByTestId("TransactionRowMode__Sent")).toBeTruthy();
		expect(getByTestId("Avatar")).toBeTruthy();
	});

	it("should show received icon", () => {
		const { getByTestId } = render(
			<TransactionRowMode transaction={{ ...TransactionFixture, isSent: () => false }} />,
		);
		expect(getByTestId("TransactionRowMode__Received")).toBeTruthy();
	});
});
