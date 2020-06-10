import React from "react";
import { IntlProvider } from "react-intl";
import { render } from "@testing-library/react";

import { ContactUs } from "../";
// i18n
import { locales } from "i18n/locales";

describe("ContactUs", () => {
	beforeEach(() => {
		jest.spyOn(console, "error").mockImplementation(() => null);
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<IntlProvider locale="en-US" messages={locales["en-US"].messages}>
				<ContactUs isOpen={false} onSend={() => void 0} />
			</IntlProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<IntlProvider locale="en-US" messages={locales["en-US"].messages}>
				<ContactUs isOpen={true} onSend={() => void 0} />
			</IntlProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent("HELP.MODAL_CONTACT_US.TITLE");
		expect(getByTestId("modal__inner")).toHaveTextContent("HELP.MODAL_CONTACT_US.DESCRIPTION");
		expect(getByTestId("modal__inner")).toHaveTextContent("HELP.MODAL_CONTACT_US.FIELD_NAME");
		expect(getByTestId("modal__inner")).toHaveTextContent("HELP.MODAL_CONTACT_US.FIELD_EMAIL");
		expect(getByTestId("modal__inner")).toHaveTextContent("HELP.MODAL_CONTACT_US.FIELD_SUBJECT");
		expect(getByTestId("modal__inner")).toHaveTextContent("HELP.MODAL_CONTACT_US.FIELD_MESSAGE");
		expect(asFragment()).toMatchSnapshot();
	});
});
