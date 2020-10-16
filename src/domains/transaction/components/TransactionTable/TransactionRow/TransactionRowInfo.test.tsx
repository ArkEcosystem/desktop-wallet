import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { TransactionRowInfo } from "./TransactionRowInfo";

describe("TransactionRowInfo", () => {
	it("should show vendor field", () => {
		const { getByTestId } = render(
			<TransactionRowInfo
				transaction={{ ...TransactionFixture, isMultiSignature: () => false }}
				vendorField="test"
			/>,
		);
		expect(getByTestId("TransactionRowInfo__vendorField")).toBeTruthy();
	});

	it("should show multi signature", () => {
		const { getByTestId } = render(
			<TransactionRowInfo transaction={{ ...TransactionFixture, isMultiSignature: () => true }} />,
		);
		expect(getByTestId("TransactionRowInfo__multiSignature")).toBeTruthy();
	});

	it("should show ledger", () => {
		const { getByTestId } = render(
			<TransactionRowInfo
				transaction={{
					...TransactionFixture,
					wallet: () => ({
						...TransactionFixture.wallet(),
						isLedger: () => true,
					}),
					isMultiSignature: () => true,
				}}
			/>,
		);
		expect(getByTestId("TransactionRowInfo__ledger")).toBeTruthy();
	});

	it("should show all", () => {
		const { getByTestId } = render(
			<TransactionRowInfo
				vendorField="test"
				transaction={{ ...TransactionFixture, isMultiSignature: () => true }}
			/>,
		);
		expect(getByTestId("TransactionRowInfo__vendorField")).toBeTruthy();
		expect(getByTestId("TransactionRowInfo__multiSignature")).toBeTruthy();
	});
});
