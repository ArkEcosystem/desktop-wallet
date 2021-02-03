import React from "react";
import { act, fireEvent, render } from "utils/testing-library";

import { ConfirmSendTransaction } from "./ConfirmSendTransaction";

describe("ConfirmSendTransaction", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<ConfirmSendTransaction isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render modal", () => {
		const { asFragment, getByTestId } = render(<ConfirmSendTransaction isOpen={true} />);

		expect(getByTestId("modal__inner")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should confirm", () => {
		const onConfirm = jest.fn();
		const { getByTestId } = render(<ConfirmSendTransaction isOpen={true} onConfirm={onConfirm} />);

		expect(getByTestId("modal__inner")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("ConfirmSendTransaction__confirm"));
		});

		expect(onConfirm).toHaveBeenCalled();
	});

	it("should cancel", () => {
		const onCancel = jest.fn();
		const { getByTestId } = render(<ConfirmSendTransaction isOpen={true} onClose={onCancel} />);

		expect(getByTestId("modal__inner")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("ConfirmSendTransaction__cancel"));
		});

		expect(onCancel).toHaveBeenCalled();
	});
});
