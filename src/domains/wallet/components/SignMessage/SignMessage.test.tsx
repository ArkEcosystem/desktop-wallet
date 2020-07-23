import React from "react";
import { fireEvent, render } from "testing-library";

import { SignMessage } from "./SignMessage";

describe("SignMessage", () => {
	it("should render the SignMessage", () => {
		const { asFragment } = render(
			<SignMessage signatoryAddress="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" isOpen={true} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as signed", () => {
		const { asFragment } = render(
			<SignMessage signatoryAddress="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" isOpen={true} isSigned={true} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle sign action", () => {
		const handleSign = jest.fn();

		const { getByTestId } = render(
			<SignMessage signatoryAddress="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" isOpen={true} onSign={handleSign} />,
		);

		fireEvent.click(getByTestId("sign-message__sign-button"));
		expect(handleSign).toHaveBeenCalled();
	});

	it("should handle close", () => {
		const handleClose = jest.fn();

		const { getByTestId } = render(
			<SignMessage signatoryAddress="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" isOpen={true} onClose={handleClose} />,
		);

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(handleClose).toHaveBeenCalled();
	});
});
