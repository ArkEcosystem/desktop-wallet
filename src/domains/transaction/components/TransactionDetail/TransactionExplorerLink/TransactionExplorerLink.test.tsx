import React from "react";
import { render } from "testing-library";

import { translations as transactionTranslations } from "../../../i18n";
import { TransactionExplorerLink } from "./TransactionExplorerLink";

describe("TransactionExplorerLink", () => {
	it("should render a transaction link", () => {
		const { container } = render(<TransactionExplorerLink id="test-id" link={`transaction-link`} />);

		expect(container).toHaveTextContent(transactionTranslations.ID);
		expect(container).toMatchSnapshot();
	});
});
