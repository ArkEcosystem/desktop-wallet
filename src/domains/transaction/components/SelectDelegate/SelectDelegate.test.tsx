import React from "react";
import { fireEvent, render } from "testing-library";

// i18n
import { translations } from "../../i18n";
import { SelectDelegate } from "./SelectDelegate";

describe("SelectDelegate", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<SelectDelegate isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<SelectDelegate isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_DELEGATE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_DELEGATE.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should only allow one selection", () => {
		const { asFragment, getByTestId } = render(<SelectDelegate isOpen={true} />);

		fireEvent.click(getByTestId("SelectedDelegateModal__select-delegate-Delegate2"));
		expect(getByTestId("SelectedDelegateModal__footer")).toHaveTextContent("Delegate2");

		fireEvent.click(getByTestId("SelectedDelegateModal__select-delegate-Delegate3"));
		expect(getByTestId("SelectedDelegateModal__footer")).not.toHaveTextContent("Delegate2");
		expect(getByTestId("SelectedDelegateModal__footer")).toHaveTextContent("Delegate3");

		expect(asFragment()).toMatchSnapshot();
	});

	it("should allow multiple selection", () => {
		const { asFragment, getByTestId } = render(<SelectDelegate isOpen={true} allowMultiple={true} />);

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
