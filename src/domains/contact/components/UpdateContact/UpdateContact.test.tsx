import React from "react";
import { render } from "test-utils";

import { translations } from "../../i18n";
import { UpdateContact } from "./UpdateContact";

describe("UpdateContact", () => {
	const onSave = jest.fn();

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<UpdateContact isOpen={false} onSave={onSave} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<UpdateContact isOpen={true} onSave={onSave} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_UPDATE_CONTACT.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});
});
