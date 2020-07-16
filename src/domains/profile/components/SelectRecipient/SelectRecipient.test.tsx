/* eslint-disable @typescript-eslint/require-await */
import { contacts } from "domains/contact/data";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

import { SelectRecipient } from "./SelectRecipient";

describe("SelectRecipient", () => {
	it("should render empty", () => {
		const { container } = render(<SelectRecipient contacts={contacts} />);
		expect(container).toMatchSnapshot();
	});

	it("should render disabled", () => {
		const { container } = render(<SelectRecipient disabled contacts={contacts} />);
		expect(container).toMatchSnapshot();
	});

	it("should render invalid", () => {
		const { container } = render(<SelectRecipient isInvalid contacts={contacts} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with preselected address", () => {
		const { container } = render(
			<SelectRecipient contacts={contacts} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should open and close contacts modal", () => {
		const { getByTestId } = render(
			<SelectRecipient contacts={contacts} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		waitFor(() => expect(getByTestId("modal__inner")).toBeFalsy());
	});

	it("should select address from contacts modal", () => {
		const { getByTestId, getAllByTestId } = render(
			<SelectRecipient contacts={contacts} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		waitFor(() => {
			expect(getByTestId("modal__inner").toThrow(/Unable to find an element by/));

			const selectedAddressValue = contacts[0]?.addresses()[0]?.address;
			expect(getByTestId("SelectRecipient__input")).toHaveValue(selectedAddressValue);
		});
	});

	it("should not open contacts modal if disabled", () => {
		const { getByTestId } = render(
			<SelectRecipient contacts={contacts} disabled address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should call onChange prop when entered address in input", async () => {
		const fn = jest.fn();
		const { getByTestId } = render(<SelectRecipient contacts={contacts} onChange={fn} />);
		const address = "bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT";
		const recipientInputField = getByTestId("SelectRecipient__input");

		await act(async () => {
			fireEvent.change(recipientInputField, { target: { value: address } });
		});

		expect(fn).toBeCalledWith(address);
	});

	it("should call onChange prop if provided", () => {
		const fn = jest.fn();
		const { getByTestId, getAllByTestId } = render(
			<SelectRecipient contacts={contacts} onChange={fn} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		waitFor(() => {
			expect(getByTestId("modal__inner").toThrow(/Unable to find an element by/));

			const selectedAddressValue = contacts[0]?.addresses()[0]?.address;
			expect(getByTestId("SelectRecipient__input")).toHaveValue(selectedAddressValue);

			expect(fn).toBeCalledWith(selectedAddressValue);
		});
	});
});
