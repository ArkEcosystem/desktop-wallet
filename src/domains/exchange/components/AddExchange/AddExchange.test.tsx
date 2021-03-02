import React from "react";
import { render } from "testing-library";

// i18n
import { translations } from "../../i18n";
import { AddExchange } from "./AddExchange";

describe("AddExchange", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<AddExchange isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<AddExchange isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});
});
