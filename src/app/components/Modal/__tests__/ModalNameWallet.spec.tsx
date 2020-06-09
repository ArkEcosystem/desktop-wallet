import React from "react";
import { IntlProvider } from "react-intl";
import { render } from "@testing-library/react";

import { ModalNameWallet } from "../";
// i18n
import { locales } from "i18n/locales";

describe("ModalNameWallet", () => {
	beforeEach(() => {
		jest.spyOn(console, "error").mockImplementation(() => null);
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<IntlProvider locale="en-US" messages={locales["en-US"].messages}>
				<ModalNameWallet isOpen={false} onSave={() => void 0} />
			</IntlProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<IntlProvider locale="en-US" messages={locales["en-US"].messages}>
				<ModalNameWallet isOpen={true} onSave={() => void 0} />
			</IntlProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent("WALLET.MODAL_NAME_WALLET.TITLE");
		expect(getByTestId("modal__inner")).toHaveTextContent("WALLET.MODAL_NAME_WALLET.DESCRIPTION");
		expect(getByTestId("modal__inner")).toHaveTextContent("WALLET.MODAL_NAME_WALLET.FIELD_NAME");
		expect(asFragment()).toMatchSnapshot();
	});
});
