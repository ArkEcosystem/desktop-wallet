/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render } from "testing-library";

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
			<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} recipients={recipients} />,
		);

		fireEvent.change(getByTestId("ProfileFormField__select-recipientAddress"), {
			target: { value: recipients[0].address },
		});
		const options = getAllByTestId("ProfileFormField__profile-select");

		expect((options[0] as HTMLOptionElement).selected).toBeTruthy();
		expect(container).toMatchSnapshot();
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
		const { getByTestId } = render(
			<AddRecipient
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				recipients={recipients}
				isSingleRecipient={false}
			/>,
		);

		const sendAll = getByTestId("add-recipient__send-all");
		const recipientSelect = getByTestId("ProfileFormField__select-recipientAddress");

		fireEvent.change(recipientSelect, { target: { value: recipients[0].address } });
		await act(async () => {
			fireEvent.click(sendAll);
		});

		const addedRecipientBtn = getByTestId("add-recipient__add-btn");
		expect(addedRecipientBtn).toBeTruthy();
	});

	it("should add secondary recipient in multiple tab", async () => {
		const { getByTestId, getAllByTestId } = render(
			<AddRecipient
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				recipients={recipients}
				isSingleRecipient={false}
			/>,
		);

		const sendAll = getByTestId("add-recipient__send-all");
		const recipientSelect = getByTestId("ProfileFormField__select-recipientAddress");

		// 1st recipient
		fireEvent.change(recipientSelect, { target: { value: recipients[0].address } });
		await act(async () => {
			fireEvent.click(sendAll);
		});

		const addedRecipientBtn1 = getByTestId("add-recipient__add-btn");
		await act(async () => {
			fireEvent.click(addedRecipientBtn1);
		});

		// 2nd recipient
		fireEvent.change(recipientSelect, { target: { value: recipients[1].address } });
		await act(async () => {
			fireEvent.click(sendAll);
		});

		const addedRecipientBtn2 = getByTestId("add-recipient__add-btn");
		await act(async () => {
			fireEvent.click(addedRecipientBtn2);
		});

		const addedRecipients = getAllByTestId("recipient-list__recipient-list-item");
		expect(addedRecipients).toHaveLength(2);
	});

	it("should remove added recipient", async () => {
		const { getByTestId, queryByText } = render(
			<AddRecipient
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				recipients={recipients}
				isSingleRecipient={false}
			/>,
		);

		const sendAll = getByTestId("add-recipient__send-all");
		const recipientSelect = getByTestId("ProfileFormField__select-recipientAddress");

		fireEvent.change(recipientSelect, { target: { value: recipients[0].address } });
		await act(async () => {
			fireEvent.click(sendAll);
		});

		const addedRecipientBtn = getByTestId("add-recipient__add-btn");
		await act(async () => {
			fireEvent.click(addedRecipientBtn);
		});

		const removeBtn = getByTestId("recipient-list__remove-recipient");
		expect(removeBtn).toBeTruthy();
		await act(async () => {
			fireEvent.click(removeBtn);
		});

		const addedRecipient = queryByText("Recipient wallet");
		expect(addedRecipient).toBeFalsy();
	});
});
