import { fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

// i18n
import { translations } from "../../i18n";
import { SelectDelegateModal } from "./";

describe("SelectDelegateModal", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SelectDelegateModal isOpen={false} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SelectDelegateModal isOpen={true} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_DELEGATE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_DELEGATE.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should only allow one selection", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SelectDelegateModal isOpen={true} />
			</I18nextProvider>,
		);

		fireEvent.click(getByTestId("SelectedDelegateModal__select-delegate-Delegate2"));
		expect(getByTestId("SelectedDelegateModal__footer")).toHaveTextContent("Delegate2");

		fireEvent.click(getByTestId("SelectedDelegateModal__select-delegate-Delegate3"));
		expect(getByTestId("SelectedDelegateModal__footer")).not.toHaveTextContent("Delegate2");
		expect(getByTestId("SelectedDelegateModal__footer")).toHaveTextContent("Delegate3");

		expect(asFragment()).toMatchSnapshot();
	});

	it("should allow multiple selection", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SelectDelegateModal isOpen={true} allowMultiple={true} />
			</I18nextProvider>,
		);

		fireEvent.click(getByTestId("SelectedDelegateModal__select-delegate-Delegate2"));
		fireEvent.click(getByTestId("SelectedDelegateModal__select-delegate-Delegate3"));
		fireEvent.click(getByTestId("SelectedDelegateModal__select-delegate-Delegate4"));
		fireEvent.click(getByTestId("SelectedDelegateModal__select-delegate-Delegate3"));
		fireEvent.click(getByTestId("SelectedDelegateModal__toggle-show-selected"));
		expect(getByTestId("SelectedDelegateModal__footer")).toHaveTextContent("Delegate2");
		expect(getByTestId("SelectedDelegateModal__footer")).toHaveTextContent("Delegate4");

		expect(asFragment()).toMatchSnapshot();
	});
});
