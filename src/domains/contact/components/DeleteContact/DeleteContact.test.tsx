import React from "react";
import { render } from "testing-library";

import { translations } from "../../i18n";
import { DeleteContact } from "./DeleteContact";

describe("DeleteContact", () => {
	const onDelete = jest.fn();

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<DeleteContact isOpen={false} onDelete={onDelete} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<DeleteContact isOpen={true} onDelete={onDelete} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_CONTACT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
