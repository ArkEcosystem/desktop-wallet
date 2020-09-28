import React from "react";
import { render } from "testing-library";

import { translations as transactionTranslations } from "../../../i18n";
import { TransactionExplorerLink } from "./TransactionExplorerLink";

describe("TransactionExplorerLink", () => {
	it.each(["transaction", "block"])("should render a '%s' link", (variant) => {
		const { container } = render(
			<TransactionExplorerLink id="test-id" link={`${variant}-link}`} variant={variant} />,
		);

		expect(container).toHaveTextContent(
			variant === "transaction" ? transactionTranslations.ID : transactionTranslations.BLOCK_ID,
		);
		expect(container).toMatchSnapshot();
	});
});
