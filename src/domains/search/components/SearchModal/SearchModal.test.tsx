import { render } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

// i18n
import { translations } from "../../i18n";
import { SearchModal } from "./SearchModal";

describe("SearchModal", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SearchModal isOpen={false} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SearchModal isOpen={true} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SearchModal isOpen={true} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).not.toHaveTextContent("Delegate");
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
			fireEvent.click(getByTestId("dropdown__option--1"));
		});
		expect(getByTestId("modal__inner")).toHaveTextContent("Delegate");
		expect(asFragment()).toMatchSnapshot();
	});
});
