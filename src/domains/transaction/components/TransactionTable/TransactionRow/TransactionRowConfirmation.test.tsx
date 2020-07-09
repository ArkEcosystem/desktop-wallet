import React from "react";
import { render } from "testing-library";

import { TransactionRowConfirmation } from "./TransactionRowConfirmation";

describe("TransactionRowConfirmation", () => {
	it("should render confirmed", () => {
		const { getByTestId } = render(<TransactionRowConfirmation confirmations="100" />);
		expect(getByTestId("TransactionRowConfirmation__confirmed")).toBeTruthy();
	});

	it("should render pending", () => {
		const { getByTestId } = render(<TransactionRowConfirmation confirmations="1" />);
		expect(getByTestId("TransactionRowConfirmation__pending")).toBeTruthy();
	});

	it("should render action required", () => {
		const { getByTestId } = render(<TransactionRowConfirmation confirmations="1" isSignaturePending />);
		expect(getByTestId("TransactionRowConfirmation__actionRequired")).toBeTruthy();
	});
});
