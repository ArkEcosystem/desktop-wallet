import { act } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render } from "test-utils";

import { searchData as data } from "../../data";
// i18n
import { translations } from "../../i18n";
import { SearchHelp } from "./SearchHelp";

describe("SearchHelp", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<SearchHelp isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<SearchHelp isOpen={true} data={data} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_HELP.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_HELP.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<SearchHelp isOpen={true} />);

		expect(getByTestId("modal__inner")).not.toHaveTextContent("Delegate");
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
			fireEvent.click(getByTestId("dropdown__option--1"));
		});
		expect(getByTestId("modal__inner")).toHaveTextContent("Delegate");
		expect(asFragment()).toMatchSnapshot();
	});
});
