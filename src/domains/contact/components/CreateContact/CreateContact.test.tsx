import React from "react";
import { render } from "testing-library";

import { translations } from "../../i18n";
import { CreateContact } from "./CreateContact";

const onSave = jest.fn();

describe("CreateContact", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<CreateContact isOpen={false} onSave={onSave} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<CreateContact isOpen={true} onSave={onSave} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
