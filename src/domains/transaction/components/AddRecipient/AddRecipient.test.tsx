/* eslint-disable @typescript-eslint/require-await */
import { contacts } from "domains/contact/data";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

import { AddRecipient } from "./AddRecipient";

const recipients = [
	{
		address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient Wallet",
		formatted: "Recipient Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
	},
	{
		address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient Multisig",
		formatted: " Recipient Multisig AhFJKDSALJFKA...SAJFKLASJKDFJ",
		isMultisig: true,
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient in Ark",
		formatted: "Recipient in Ark FAhFJKDSALJFK...SAJFKLASJKDFJ",
		isInArkNetwork: true,
	},
];

describe("AddRecipient", () => {
	it("should render", () => {
		const { container } = render(
			<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} recipients={recipients} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render without recipients", () => {
		const { container } = render(<AddRecipient />);
		expect(container).toMatchSnapshot();
	});

	it("should render with multiple recipients tab", () => {
		const { container } = render(
			<AddRecipient
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				recipients={recipients}
				isSingleRecipient={false}
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should select recipient", () => {
		const { getByTestId, getAllByTestId, container } = render(
			<AddRecipient
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				recipients={recipients}
				contacts={contacts}
			/>,
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

	it("should set available amount", async () => {
		const { getByTestId, container } = render(
			<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} recipients={recipients} />,
		);
		const sendAll = getByTestId("add-recipient__send-all");
		const amountInput = getByTestId("add-recipient__amount-input");
		await act(async () => {
			fireEvent.click(sendAll);
		});

		expect(amountInput).toHaveValue(80);
		expect(container).toMatchSnapshot();
	});

	it("should toggle between single and multiple recipients", async () => {
		const { getByTestId } = render(
			<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} recipients={recipients} />,
		);
		const singleButton = getByTestId("add-recipient-is-single-toggle");
		const multipleButton = getByTestId("add-recipient-is-multiple-toggle");

		await act(async () => {
			fireEvent.click(multipleButton);
		});
		expect(getByTestId("add-recipient__form-wrapper")).toHaveClass("MultiRecipientWrapper");

		await act(async () => {
			fireEvent.click(singleButton);
		});

		expect(getByTestId("add-recipient__form-wrapper")).not.toHaveClass("MultiRecipientWrapper");
	});

	it("should show add recipient button when recipient and amount are set in multipe tab", async () => {
		const { getByTestId, getAllByTestId } = render(
			<AddRecipient
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				recipients={recipients}
				isSingleRecipient={false}
				contacts={contacts}
			/>,
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

		act(() => {
			fireEvent.click(getByTestId("add-recipient__send-all"));
		});

		waitFor(() => {
			const addedRecipientBtn = getByTestId("add-recipient__add-btn");
			expect(addedRecipientBtn).toBeTruthy();
		});
	});

	it("should add two recipients in multiple tab", async () => {
		const { getByTestId, getAllByTestId } = render(
			<AddRecipient
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				recipients={recipients}
				isSingleRecipient={false}
				contacts={contacts}
			/>,
		);

		const sendAll = getByTestId("add-recipient__send-all");
		act(() => {
			fireEvent.click(sendAll);
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();
		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		const addedRecipientBtn1 = getByTestId("add-recipient__add-btn");
		act(() => {
			fireEvent.click(addedRecipientBtn1);
		});

		// 2nd recipient

		act(() => {
			fireEvent.click(sendAll);
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();
		const secondAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];
		act(() => {
			fireEvent.click(secondAddress);
		});

		waitFor(() => {
			const addedRecipients = getAllByTestId("recipient-list__recipient-list-item");
			expect(addedRecipients).toHaveLength(2);
		});
	});

	it("should remove added recipient", async () => {
		const { getByTestId, getAllByTestId, queryByText } = render(
			<AddRecipient
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				recipients={recipients}
				isSingleRecipient={false}
				contacts={contacts}
			/>,
		);

		const sendAll = getByTestId("add-recipient__send-all");
		act(() => {
			fireEvent.click(sendAll);
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();
		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		const addedRecipientBtn1 = getByTestId("add-recipient__add-btn");
		act(() => {
			fireEvent.click(addedRecipientBtn1);
		});

		const removeBtn = getByTestId("recipient-list__remove-recipient");
		expect(removeBtn).toBeTruthy();
		act(() => {
			fireEvent.click(removeBtn);
		});

		const addedRecipient = queryByText("Recipient wallet");
		expect(addedRecipient).toBeFalsy();
	});
});
