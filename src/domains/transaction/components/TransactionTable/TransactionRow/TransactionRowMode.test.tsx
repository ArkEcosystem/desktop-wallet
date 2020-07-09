import React from "react";
import { render } from "testing-library";

import { TransactionRowMode } from "./TransactionRowMode";

describe("TransactionRowMode", () => {
	it("should show sent icon", () => {
		const { getByTestId } = render(<TransactionRowMode type="transfer" recipient="abc" isSent />);
		expect(getByTestId("TransactionRowMode__Sent")).toBeTruthy();
		expect(getByTestId("Avatar")).toBeTruthy();
	});

	it("should show received icon", () => {
		const { getByTestId } = render(<TransactionRowMode type="transfer" recipient="abc" isSent={false} />);
		expect(getByTestId("TransactionRowMode__Received")).toBeTruthy();
	});
});
