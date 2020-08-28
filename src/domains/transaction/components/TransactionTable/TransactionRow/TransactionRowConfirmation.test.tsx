import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { TransactionRowConfirmation } from "./TransactionRowConfirmation";

describe("TransactionRowConfirmation", () => {
	it("should render confirmed", () => {
		const { getByTestId } = render(
			<TransactionRowConfirmation transaction={{ ...TransactionFixture, isConfirmed: () => true }} />,
		);
		expect(getByTestId("TransactionRowConfirmation__confirmed")).toBeTruthy();
	});

	it("should render pending", () => {
		const { getByTestId } = render(
			<TransactionRowConfirmation transaction={{ ...TransactionFixture, isConfirmed: () => false }} />,
		);
		expect(getByTestId("TransactionRowConfirmation__pending")).toBeTruthy();
	});

	it("should render action required", () => {
		const { getByTestId } = render(
			<TransactionRowConfirmation transaction={TransactionFixture} isSignaturePending />,
		);
		expect(getByTestId("TransactionRowConfirmation__actionRequired")).toBeTruthy();
	});
});
