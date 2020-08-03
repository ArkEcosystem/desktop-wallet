import React from "react";
import { render } from "testing-library";
import { TransactionFixture } from "tests/fixtures/transactions";

import { TransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";

describe("TransactionRowRecipientLabel", () => {
	it("should show address", () => {
		const { getByTestId } = render(<TransactionRowRecipientLabel transaction={TransactionFixture} />);
		expect(getByTestId("address__wallet-address")).toHaveTextContent("ASuusX…GQ3kqT");
	});

	it("should show label", () => {
		const { getByText } = render(
			<TransactionRowRecipientLabel transaction={{ ...TransactionFixture, type: () => "secondSignature" }} />,
		);
		expect(getByText("2nd Signature Creation")).toBeTruthy();
	});
});
