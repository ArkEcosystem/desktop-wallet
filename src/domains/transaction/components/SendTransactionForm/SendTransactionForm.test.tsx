/* eslint-disable @typescript-eslint/require-await */
import { contacts } from "domains/contact/data";
import { availableNetworksMock } from "domains/network/data";
import { wallets } from "domains/wallet/data";
import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render, waitFor, within } from "testing-library";

import { SendTransactionForm } from "./";

const networks = availableNetworksMock;

describe("SendTransactionForm", () => {
	it("should render", () => {
		const { container } = render(<SendTransactionForm wallets={wallets} contacts={contacts} networks={networks} />);
		expect(container).toMatchSnapshot();
	});

	it("should select sender and recipient", async () => {
		const { getByTestId, getAllByTestId } = render(
			<SendTransactionForm wallets={wallets} contacts={contacts} networks={networks} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
		});
		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getByTestId("AddressListItem__select-0");

		act(() => {
			fireEvent.click(firstAddress);
		});

		await waitFor(
			() => {
				expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
			},
			{ timeout: 2000 },
		);
		const selectedAddressValue = contacts[0]?.addresses()[0]?.address;
		expect(within(getByTestId("sender-address")).getByTestId("SelectAddress__input")).toHaveValue(
			selectedAddressValue,
		);

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-contact"));
		});
		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const address = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(address);
		});

		await waitFor(
			() => {
				expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
			},
			{ timeout: 2000 },
		);
		const recipientSelectedAddress = contacts[0]?.addresses()[0]?.address;
		expect(getByTestId("SelectRecipient__input")).toHaveValue(recipientSelectedAddress);
	});

	it("should set available amount", async () => {
		const { getByTestId, container } = render(
			<SendTransactionForm wallets={wallets} contacts={contacts} maxAvailableAmount={100} />,
		);
		const sendAll = getByTestId("add-recipient__send-all");
		const amountInput = getByTestId("add-recipient__amount-input");

		await act(async () => {
			fireEvent.click(sendAll);
		});

		expect(amountInput).toHaveValue(100);
		expect(container).toMatchSnapshot();
	});

	it("should emit goBack button click", async () => {
		// Select network to enable buttons
		const fn = jest.fn();
		const { getByTestId } = render(<SendTransactionForm onBack={fn} contacts={contacts} networks={networks} />);
		const backBtn = getByTestId("send-transaction-click-back");

		await act(async () => {
			fireEvent.click(backBtn);
		});

		expect(fn).toBeCalled();
	});

	it("should submit form", async () => {
		const fn = jest.fn();
		const { getByTestId } = render(<SendTransactionForm onSubmit={fn} contacts={contacts} networks={networks} />);
		const submit = getByTestId("send-transaction-click-submit");
		act(() => {
			fireEvent.click(submit);
		});

		await waitFor(() => {
			expect(fn).toBeCalled();
		});
	});
});
