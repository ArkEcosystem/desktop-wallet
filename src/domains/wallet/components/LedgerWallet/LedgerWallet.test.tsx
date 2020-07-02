import React from "react";
import { render } from "testing-library";

import { translations as WALLETS } from "../../i18n";
import { LedgerWallet } from "./LedgerWallet";

describe("LedgerWallet", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<LedgerWallet isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<LedgerWallet isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(WALLETS.MODAL_LEDGER_WALLET.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(WALLETS.MODAL_LEDGER_WALLET.DESCRIPTION);
		expect(getByTestId("modal__inner")).toHaveTextContent(WALLETS.MODAL_LEDGER_WALLET.WAITING_FOR_LEDGER);
		expect(asFragment()).toMatchSnapshot();
	});
});
