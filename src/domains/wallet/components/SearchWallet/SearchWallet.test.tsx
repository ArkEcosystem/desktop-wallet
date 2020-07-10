import React from "react";
import { fireEvent, render } from "testing-library";

import { wallets } from "../../data";
// i18n
import { translations } from "../../i18n";
import { SearchWallet } from "./SearchWallet";

describe("SearchWallet", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(<SearchWallet isOpen={true} wallets={wallets} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle close", () => {
		const onClose = jest.fn();

		const { getByTestId } = render(<SearchWallet isOpen={true} onClose={onClose} />);

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(onClose).toHaveBeenCalled();
	});
});
