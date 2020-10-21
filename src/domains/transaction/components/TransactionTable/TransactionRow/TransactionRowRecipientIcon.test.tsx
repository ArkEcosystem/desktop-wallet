import React from "react";
import { render } from "testing-library";

import { TransactionRowRecipientIcon } from "./TransactionRowRecipientIcon";

describe("TransactionRowRecipientIcon", () => {
	it("should render avatar", () => {
		const { getByTestId, asFragment } = render(<TransactionRowRecipientIcon type="transfer" recipient="test" />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render icon", () => {
		const { getByTestId, asFragment } = render(<TransactionRowRecipientIcon type="secondSignature" />);
		expect(getByTestId("TransactionRowRecipientIcon")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
