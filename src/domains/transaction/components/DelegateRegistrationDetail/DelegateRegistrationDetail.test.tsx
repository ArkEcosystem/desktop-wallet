import React from "react";
import { render } from "testing-library";

// i18n
import { translations } from "../../i18n";
import { DelegateRegistrationDetail } from "./DelegateRegistrationDetail";

describe("DelegateRegistrationDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<DelegateRegistrationDetail isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<DelegateRegistrationDetail isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELEGATE_REGISTRATION_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});
});
