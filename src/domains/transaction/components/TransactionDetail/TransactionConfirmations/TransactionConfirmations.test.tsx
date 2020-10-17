import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";

import { translations as transactionTranslations } from "../../../i18n";
import { TransactionConfirmations } from "./TransactionConfirmations";

describe("TransactionConfirmations", () => {
	it("should render when confirmed", () => {
		const { container } = render(<TransactionConfirmations isConfirmed={true} confirmations={BigNumber.ONE} />);

		expect(container).toHaveTextContent(transactionTranslations.WELL_CONFIRMED);
		expect(container).not.toHaveTextContent(transactionTranslations.NOT_CONFIRMED);
		expect(container).toHaveTextContent("status-ok.svg");

		expect(container).toMatchSnapshot();
	});

	it("should render when not confirmed", () => {
		const { container } = render(<TransactionConfirmations isConfirmed={false} confirmations={BigNumber.ONE} />);

		expect(container).not.toHaveTextContent(transactionTranslations.WELL_CONFIRMED);
		expect(container).toHaveTextContent(transactionTranslations.NOT_CONFIRMED);
		expect(container).toHaveTextContent("status-pending.svg");

		expect(container).toMatchSnapshot();
	});
});
