import React from "react";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";

import { i18n } from "app/i18n";

import { UpdateWalletName } from "./";
// i18n
import { translations } from "../../i18n";

describe("UpdateWalletName", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<UpdateWalletName isOpen={false} onSave={() => void 0} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<UpdateWalletName isOpen={true} onSave={() => void 0} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.DESCRIPTION);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.FIELD_NAME);
		expect(asFragment()).toMatchSnapshot();
	});
});
