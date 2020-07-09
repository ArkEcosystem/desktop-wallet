import React from "react";
import { render } from "testing-library";

import { TransactionRowInfo } from "./TransactionRowInfo";

describe("TransactionRowInfo", () => {
	it("should show vendor field", () => {
		const { getByTestId } = render(<TransactionRowInfo vendorField="test" />);
		expect(getByTestId("TransactionRowInfo__vendorField")).toBeTruthy();
	});

	it("should show multi signature", () => {
		const { getByTestId } = render(<TransactionRowInfo isMultiSignature />);
		expect(getByTestId("TransactionRowInfo__multiSignature")).toBeTruthy();
	});

	it("should show all", () => {
		const { getByTestId } = render(<TransactionRowInfo vendorField="test" isMultiSignature />);
		expect(getByTestId("TransactionRowInfo__vendorField")).toBeTruthy();
		expect(getByTestId("TransactionRowInfo__multiSignature")).toBeTruthy();
	});
});
