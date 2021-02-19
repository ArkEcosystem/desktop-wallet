/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { FeeWarning } from "./FeeWarning";

describe("FeeWarning", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<FeeWarning isOpen={false} onCancel={jest.fn()} onConfirm={jest.fn()} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<FeeWarning isOpen={true} onCancel={jest.fn()} onConfirm={jest.fn()} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_FEE_WARNING.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_FEE_WARNING.DESCRIPTION);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should call onCancel callback when closing the modal", () => {
		const onCancel = jest.fn();

		const { getByTestId } = render(<FeeWarning isOpen={true} onCancel={onCancel} onConfirm={jest.fn()} />);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(onCancel).toHaveBeenCalled();
	});

	it("should call onCancel callback when clicking on cancel button", () => {
		const onCancel = jest.fn();

		const { getByTestId } = render(<FeeWarning isOpen={true} onCancel={onCancel} onConfirm={jest.fn()} />);

		act(() => {
			fireEvent.click(getByTestId("FeeWarning__cancel-button"));
		});

		expect(onCancel).toHaveBeenCalled();
	});

	it.each([true, false])(
		"should pass %s to onConfirm callback when clicking on continue button",
		(doNotShowAgain) => {
			const onConfirm = jest.fn();

			const { getByTestId } = render(<FeeWarning isOpen={true} onCancel={jest.fn()} onConfirm={onConfirm} />);

			if (doNotShowAgain) {
				act(() => {
					fireEvent.click(getByTestId("FeeWarning__doNotShowAgain-toggle"));
				});
			}

			act(() => {
				fireEvent.click(getByTestId("FeeWarning__continue-button"));
			});

			waitFor(() => {
				expect(onConfirm).toHaveBeenCalledWith(doNotShowAgain);
			});
		},
	);
});
