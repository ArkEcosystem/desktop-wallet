/* eslint-disable @typescript-eslint/require-await */
import { contacts } from "domains/contact/data";
import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render, waitFor, within } from "testing-library";

import { networks } from "../../data";
import { SendTransactionForm } from "./";

describe("SendTransactionForm", () => {
	it("should render", () => {
		const { container } = render(<SendTransactionForm contacts={contacts} networks={networks} />);
		expect(container).toMatchSnapshot();
	});

	it("should select sender and recipient", () => {
		const { getByTestId, getAllByTestId } = render(
			<SendTransactionForm profiles={contacts} contacts={contacts} networks={networks} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		waitFor(
			() => {
				expect(getByTestId("modal__inner").toThrow(/Unable to find an element by/));
			},
			{ timeout: 2000 },
		);
		const selectedAddressValue = contacts[0]?.addresses()[0]?.address;
		expect(within(getByTestId("sender-address")).getByTestId("SelectAddress__input")).toHaveValue(
			selectedAddressValue,
		);

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectAddress__wrapper"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		const address = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(address);
		});

		waitFor(
			() => {
				expect(getByTestId("modal__inner").toThrow(/Unable to find an element by/));
			},
			{ timeout: 2000 },
		);
		const recipientSelectedAddress = contacts[0]?.addresses()[0]?.address;
		expect(within(getByTestId("recipient-address")).getByTestId("SelectAddress__input")).toHaveValue(
			recipientSelectedAddress,
		);
	});

	it("should set available amount", () => {
		const { getByTestId, container } = render(<SendTransactionForm contacts={contacts} maxAvailableAmount={100} />);
		const sendAll = getByTestId("add-recipient__send-all");
		const amountInput = getByTestId("add-recipient__amount-input");
		act(() => {
			fireEvent.click(sendAll);
		});

		expect(amountInput).toHaveValue(100);
		expect(container).toMatchSnapshot();
	});

	it("should emit goBack button click", () => {
		// Select network to enable buttons
		const fn = jest.fn();
		const { getByTestId } = render(<SendTransactionForm onBack={fn} contacts={contacts} networks={networks} />);
		const backBtn = getByTestId("send-transaction-click-back");

		act(() => {
			fireEvent.click(backBtn);
		});

		expect(fn).toBeCalled();
	});

	it("should submit form", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<SendTransactionForm onSubmit={fn} contacts={contacts} networks={networks} />);
		const submit = getByTestId("send-transaction-click-submit");
		act(() => {
			fireEvent.click(submit);
		});

		waitFor(() => {
			expect(fn).toBeCalled();
		});
	});

	it("should not call onSubmit callback if not provided", async () => {
		// Select network to enable buttons
		const fn = jest.fn();
		const { getByTestId, container } = render(<SendTransactionForm contacts={contacts} networks={networks} />);
		const submit = getByTestId("send-transaction-click-submit");
		await act(async () => {
			fireEvent.click(submit);
		});

		expect(container).toMatchSnapshot();
		expect(fn).not.toHaveBeenCalled();
	});

	it("should not call onBack callback if not provided", async () => {
		// Select network to enable buttons
		const fn = jest.fn();
		const { getByTestId, container } = render(<SendTransactionForm contacts={contacts} networks={networks} />);
		const back = getByTestId("send-transaction-click-back");
		await act(async () => {
			fireEvent.click(back);
		});

		expect(container).toMatchSnapshot();
		expect(fn).not.toHaveBeenCalled();
	});
});
