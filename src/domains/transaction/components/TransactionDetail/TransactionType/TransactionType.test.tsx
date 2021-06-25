import React from "react";
import { render } from "testing-library";

import { translations } from "../../../i18n";
import { TransactionType } from "./TransactionType";

describe("TransactionType", () => {
	it("should render", () => {
		const { container } = render(<TransactionType type="multiPayment" />);

		expect(container).toHaveTextContent("multipayment.svg");
		expect(container).toHaveTextContent(translations.TRANSACTION_TYPES.MULTI_PAYMENT);

		expect(container).toMatchSnapshot();
	});
});
