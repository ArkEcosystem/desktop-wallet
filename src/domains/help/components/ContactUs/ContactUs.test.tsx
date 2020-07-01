import React from "react";
import { render } from "test-utils";

import { translations } from "../../i18n";
import { ContactUs } from "./ContactUs";

describe("ContactUs", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<ContactUs isOpen={false} onSend={() => void 0} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<ContactUs isOpen={true} onSend={() => void 0} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.DESCRIPTION);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.FIELD_NAME);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.FIELD_EMAIL);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.FIELD_SUBJECT);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CONTACT_US.FIELD_MESSAGE);
		expect(asFragment()).toMatchSnapshot();
	});
});
