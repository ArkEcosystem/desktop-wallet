import React from "react";
import { render } from "testing-library";

import { TransactionRowRecipientIcon } from "./TransactionRowRecipientIcon";

describe("TransactionRowRecipientIcon", () => {
	it("should render avatar", () => {
		const { getByTestId, asFragment } = render(<TransactionRowRecipientIcon type="transfer" recipient="test" />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render counter", () => {
		const recipients = [
			{ amount: "1", address: "test" },
			{ amount: "2", address: "test2" },
		];
		const { getByTestId, asFragment } = render(
			<TransactionRowRecipientIcon type="multiPayment" recipients={recipients} />,
		);
		expect(getByTestId("TransactionRowRecipientIcon")).toHaveTextContent(recipients.length.toString());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render icon", () => {
		const { getByTestId, asFragment } = render(<TransactionRowRecipientIcon type="secondSignature" />);
		expect(getByTestId("TransactionRowRecipientIcon")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
