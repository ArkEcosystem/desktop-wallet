import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { BaseTransactionRowMode,TransactionRowMode } from "./TransactionRowMode";

describe("TransactionRowMode", () => {
	it("should show sent icon", () => {
		const { getByTestId } = render(<TransactionRowMode transaction={TransactionFixture} />);
		expect(getByTestId("TransactionRowMode__Sent")).toBeTruthy();
		expect(getByTestId("Avatar")).toBeTruthy();
	});

	it("should show sent icon", () => {
		const { getByTestId } = render(
			<TransactionRowMode transaction={{ ...TransactionFixture, isSent: () => true }} />,
		);
		expect(getByTestId("TransactionRowMode__Sent")).toBeTruthy();
	});

	it("should show received icon", () => {
		const { getByTestId } = render(
			<TransactionRowMode transaction={{ ...TransactionFixture, isSent: () => false }} />,
		);
		expect(getByTestId("TransactionRowMode__Received")).toBeTruthy();
	});

	it("should show return icon", () => {
		const { getByTestId } = render(
			<TransactionRowMode transaction={{ ...TransactionFixture, isReturn: () => true }} />,
		);
		expect(getByTestId("TransactionRowMode__Return")).toBeTruthy();
	});

	it("should use default icon size", () => {
		const { getByTestId } = render(<BaseTransactionRowMode transaction={{ ...TransactionFixture }} />);
		expect(getByTestId("TransactionRowMode__Received")).toBeTruthy();
	});

	it("should use sm icon size", () => {
		const { getByTestId } = render(
			<BaseTransactionRowMode transaction={{ ...TransactionFixture }} iconSize="sm" />,
		);
		expect(getByTestId("TransactionRowMode__Received")).toBeTruthy();
	});
});
