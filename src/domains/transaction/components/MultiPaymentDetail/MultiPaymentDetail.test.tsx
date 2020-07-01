import React from "react";
import { render } from "test-utils";

// i18n
import { translations } from "../../i18n";
import { MultiPaymentDetail } from "./MultiPaymentDetail";

describe("MultiPaymentDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<MultiPaymentDetail isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<MultiPaymentDetail isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});
});
