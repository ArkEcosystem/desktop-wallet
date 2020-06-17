import { fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

// i18n
import { translations } from "../../i18n";
import { SelectAccount } from "./";

describe("SelectAccount", () => {
	it("should render", () => {
		const { asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<SelectAccount isOpen={true} wallets={wallets} />
			</I18nextProvider>,
			);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.DESCIRPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with a wallet name", () => {
		const { asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<ReceiveFunds
					isOpen={true}
					wallet={{
						...wallet,
						walletName: "My Wallet",
					}}
				/>
			</I18nextProvider>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle close", () => {
		const handleClose = jest.fn();

		const { getByTestId } = render(<SelectAccount isOpen={true} handleClose={handleClose} />);

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(handleClose).toHaveBeenCalled();
	});
});
