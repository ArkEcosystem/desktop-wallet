import React from "react";
import { render } from "testing-library";

import { TransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";

describe("TransactionRowRecipientLabel", () => {
	it("should show address", () => {
		const { getByTestId } = render(<TransactionRowRecipientLabel type="transfer" recipient="test" />);
		expect(getByTestId("address__wallet-address")).toHaveTextContent("test");
	});

	it("should show label", () => {
		const { getByText } = render(<TransactionRowRecipientLabel type="secondSignature" recipient="test" />);
		expect(getByText("2nd Signature Creation")).toBeTruthy();
	});
});
