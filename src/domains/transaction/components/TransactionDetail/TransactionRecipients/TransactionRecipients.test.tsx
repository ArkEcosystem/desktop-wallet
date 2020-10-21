import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";

import { translations as transactionTranslations } from "../../../i18n";
import { TransactionRecipients } from "./TransactionRecipients";

describe("TransactionRecipients", () => {
	it("should render a single recipient", () => {
		const address = "test-address";

		const { container } = render(<TransactionRecipients currency="DARK" recipients={[{ address }]} />);

		expect(container).toHaveTextContent(transactionTranslations.RECIPIENT);
		expect(container).toHaveTextContent(address);

		expect(container).toMatchSnapshot();
	});

	it("should render a single recipient with alias", () => {
		const address = "test-address";
		const alias = "test-alias";

		const { container } = render(<TransactionRecipients currency="DARK" recipients={[{ address, alias }]} />);

		expect(container).toHaveTextContent(transactionTranslations.RECIPIENT);
		expect(container).toHaveTextContent(address);
		expect(container).toHaveTextContent(alias);

		expect(container).toMatchSnapshot();
	});

	it("should render a recipients array", () => {
		const address = "test-address";

		const { container } = render(
			<TransactionRecipients
				currency="DARK"
				recipients={[
					{ address, amount: BigNumber.ONE },
					{ address, amount: BigNumber.ONE },
				]}
			/>,
		);

		expect(container).toHaveTextContent("1 DARK");
		expect(container).toHaveTextContent(address);

		expect(container).toMatchSnapshot();
	});
});
