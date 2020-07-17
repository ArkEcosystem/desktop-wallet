import { wallets } from "domains/wallet/data";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

import { SelectAddress } from "./SelectAddress";

describe("SelectAddress", () => {
	it("should render empty", () => {
		const { container } = render(<SelectAddress wallets={wallets} />);
		expect(container).toMatchSnapshot();
	});

	it("should render disabled", () => {
		const { container } = render(<SelectAddress disabled wallets={wallets} />);
		expect(container).toMatchSnapshot();
	});

	it("should render invalid", () => {
		const { container } = render(<SelectAddress isInvalid wallets={wallets} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with preselected address", () => {
		const { container } = render(
			<SelectAddress wallets={wallets} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render with preselected verified address", () => {
		const { container } = render(<SelectAddress isVerified wallets={wallets} />);
		expect(container).toMatchSnapshot();
	});

	it("should open and close wallets modal", () => {
		const { getByTestId } = render(
			<SelectAddress wallets={wallets} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
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

	it("should select address from wallets modal", () => {
		const { getByTestId, getAllByTestId } = render(
			<SelectAddress wallets={wallets} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		const firstAddress = getAllByTestId("AddressListItem__select-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		waitFor(() => {
			expect(getByTestId("modal__inner").toThrow(/Unable to find an element by/));

			const selectedAddressValue = wallets[0].address;
			expect(getByTestId("SelectAddress__input")).toHaveValue(selectedAddressValue);
		});
	});

	it("should not open wallets modal if disabled", () => {
		const { getByTestId } = render(
			<SelectAddress wallets={wallets} disabled address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
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
			<SelectAddress wallets={wallets} onChange={fn} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		const firstAddress = getAllByTestId("AddressListItem__select-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		waitFor(() => {
			expect(getByTestId("modal__inner").toThrow(/Unable to find an element by/));

			const selectedAddressValue = wallets[0]?.addresses()[0]?.address;
			expect(getByTestId("SelectAddress__input")).toHaveValue(selectedAddressValue);

			expect(fn).toBeCalledWith(selectedAddressValue);
		});
	});
});
