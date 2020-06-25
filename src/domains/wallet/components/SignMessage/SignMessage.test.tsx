import { fireEvent, render } from "@testing-library/react";
import React from "react";

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
			<SignMessage signatoryAddress="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" isSigned={true} isOpen={true} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle sign action", () => {
		const handleSign = jest.fn();

		const { getByTestId } = render(
			<SignMessage signatoryAddress="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" handleSign={handleSign} isOpen={true} />,
		);

		fireEvent.click(getByTestId("sign-message__sign-button"));
		expect(handleSign).toHaveBeenCalled();
	});

	it("should handle close", () => {
		const handleClose = jest.fn();

		const { getByTestId } = render(
			<SignMessage
				signatoryAddress="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"
				handleClose={handleClose}
				isOpen={true}
			/>,
		);

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(handleClose).toHaveBeenCalled();
	});
});
