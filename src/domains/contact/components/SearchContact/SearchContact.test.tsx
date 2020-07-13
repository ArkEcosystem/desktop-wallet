import React from "react";
import { render } from "testing-library";

import { contacts } from "../../data";
import { translations } from "../../i18n";
import { SearchContact } from "./SearchContact";

describe("SearchContact", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<SearchContact isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<SearchContact isOpen={true} contacts={contacts} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_CONTACT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal with custom title and description", () => {
		const title = "Modal title";
		const description = "Modal description";
		const { asFragment, getByTestId } = render(
			<SearchContact isOpen={true} contacts={contacts} title={title} description={description} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent("Modal title");
		expect(getByTestId("modal__inner")).toHaveTextContent("Modal description");
		expect(asFragment()).toMatchSnapshot();
	});
});
