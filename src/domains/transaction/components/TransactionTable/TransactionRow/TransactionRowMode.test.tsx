import React from "react";
import { render, screen } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { BaseTransactionRowMode, TransactionRowMode } from "./TransactionRowMode";

describe("TransactionRowMode", () => {
	it("should show sent icon", () => {
		render(<TransactionRowMode transaction={TransactionFixture} />);

		expect(screen.getByTestId("TransactionRowMode")).toHaveTextContent("sent.svg");
		expect(screen.getByTestId("Avatar")).toBeTruthy();
	});

	it("should show sent icon", () => {
		render(<TransactionRowMode transaction={{ ...TransactionFixture, isSent: () => true }} />);

		expect(screen.getByTestId("TransactionRowMode")).toHaveTextContent("sent.svg");
	});

	it("should show received icon", () => {
		render(<TransactionRowMode transaction={{ ...TransactionFixture, isSent: () => false }} />);

		expect(screen.getByTestId("TransactionRowMode")).toHaveTextContent("received.svg");
	});

	it("should show return icon", () => {
		render(<TransactionRowMode transaction={{ ...TransactionFixture, isReturn: () => true }} />);

		expect(screen.getByTestId("TransactionRowMode")).toHaveTextContent("return.svg");
	});

	it("should use default icon size", () => {
		render(<BaseTransactionRowMode transaction={{ ...TransactionFixture }} />);

		expect(screen.getByTestId("TransactionRowMode")).toHaveTextContent("received.svg");
	});

	it("should use sm icon size", () => {
		render(<BaseTransactionRowMode transaction={{ ...TransactionFixture }} iconSize="sm" />);

		expect(screen.getByTestId("TransactionRowMode")).toHaveTextContent("received.svg");
	});
});
