import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { render } from "testing-library";

import { translations as transactionTranslations } from "../../../i18n";
import { TransactionNetwork } from "./TransactionNetwork";

describe("TransactionNetwork", () => {
	it("should render", () => {
		const network = availableNetworksMock.find((network) => network.id() === "ark.devnet");

		const { container } = render(<TransactionNetwork network={network!} />);

		expect(container).toHaveTextContent(transactionTranslations.CRYPTOASSET);
		expect(container).toHaveTextContent("ark.svg");

		expect(container).toMatchSnapshot();
	});
});
