import React from "react";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";

import { i18n } from "app/i18n";
import { translations } from "../../../i18n";

import { ContactUs } from "../";

describe("ContactUs", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<ContactUs isOpen={false} onSend={() => void 0} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<ContactUs isOpen={true} onSend={() => void 0} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.DESCRIPTION);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.FIELD_NAME);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.FIELD_EMAIL);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.FIELD_SUBJECT);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.FIELD_MESSAGE);
		expect(asFragment()).toMatchSnapshot();
	});
});
