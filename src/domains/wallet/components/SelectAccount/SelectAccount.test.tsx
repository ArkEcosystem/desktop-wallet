import { fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { wallets } from "../../data";
// i18n
import { translations } from "../../i18n";
import { SelectAccount } from "./SelectAccount";

describe("SelectAccount", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SelectAccount isOpen={true} wallets={wallets} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle close", () => {
		const handleClose = jest.fn();

		const { getByTestId } = render(<SelectAccount isOpen={true} handleClose={handleClose} />);

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(handleClose).toHaveBeenCalled();
	});
});
