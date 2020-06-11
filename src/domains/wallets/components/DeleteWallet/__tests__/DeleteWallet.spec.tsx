import React from "react";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";

import { i18n } from "app/i18n";

import { DeleteWallet } from "../";
// i18n
import { translations } from "../../../i18n.ts";

describe("DeleteWallet", () => {
	beforeEach(() => {
		jest.spyOn(console, "error").mockImplementation(() => null);
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<DeleteWallet isOpen={false} onDelete={() => void 0} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<DeleteWallet isOpen={true} onDelete={() => void 0} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_WALLET.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_WALLET.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
