import { contacts } from "domains/contact/data";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

import { SelectAddress } from "./SelectAddress";

describe("SelectAddress", () => {
	it("should render empty", () => {
		const { container } = render(<SelectAddress contacts={contacts} />);
		expect(container).toMatchSnapshot();
	});

	it("should render disabled", () => {
		const { container } = render(<SelectAddress disabled contacts={contacts} />);
		expect(container).toMatchSnapshot();
	});

	it("should render invalid", () => {
		const { container } = render(<SelectAddress isInvalid contacts={contacts} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with preselected address", () => {
		const { container } = render(
			<SelectAddress contacts={contacts} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render with preselected verified address", () => {
		const { container } = render(<SelectAddress isVerified contacts={contacts} />);
		expect(container).toMatchSnapshot();
	});

	it("should open and close contacts modal", () => {
		const { getByTestId } = render(
			<SelectAddress contacts={contacts} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		waitFor(() => expect(getByTestId("modal__inner")).toBeFalsy());
	});

	it("should select address from contacts modal", () => {
		const { getByTestId, getAllByTestId } = render(
			<SelectAddress contacts={contacts} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		waitFor(() => {
			expect(getByTestId("modal__inner").toThrow(/Unable to find an element by/));

			const selectedAddressValue = contacts[0]?.addresses()[0]?.address;
			expect(getByTestId("SelectAddress__input")).toHaveValue(selectedAddressValue);
		});
	});

	it("should not open contacts modal if disabled", () => {
		const { getByTestId } = render(
			<SelectAddress contacts={contacts} disabled address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should call onChange prop if provided", () => {
		const fn = jest.fn();
		const { getByTestId, getAllByTestId } = render(
			<SelectAddress contacts={contacts} onChange={fn} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		waitFor(() => {
			expect(getByTestId("modal__inner").toThrow(/Unable to find an element by/));

			const selectedAddressValue = contacts[0]?.addresses()[0]?.address;
			expect(getByTestId("SelectAddress__input")).toHaveValue(selectedAddressValue);

			expect(fn).toBeCalledWith(selectedAddressValue);
		});
	});
});
