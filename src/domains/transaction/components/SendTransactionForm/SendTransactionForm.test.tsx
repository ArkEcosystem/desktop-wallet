/* eslint-disable @typescript-eslint/require-await */
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import { SendTransactionForm } from "./";

describe("SendTransactionForm", () => {
	const networks = [
		{
			value: "ark",
			label: "Ark Ecosystem",
			icon: "Ark",
		},
	];

	it("should render", () => {
		const { container } = render(<SendTransactionForm />);
		expect(container).toMatchSnapshot();
	});

	it("should select network", () => {
		const { getByTestId, getAllByTestId, container } = render(<SendTransactionForm networks={networks} />);
		fireEvent.change(getByTestId("send-transaction__network-select"), { target: { value: "ark" } });
		const options = getAllByTestId("send-transaction__network-option");
		expect((options[0] as HTMLOptionElement).selected).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it("should select sender", () => {
		const senderList = [
			{
				address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				walletName: "My Wallet",
				avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
			},
		];

		const { getByTestId, getAllByTestId, container } = render(
			<SendTransactionForm senderList={senderList} networks={networks} />,
		);
		fireEvent.change(getByTestId("send-transaction__select-sender"), {
			target: { value: senderList[0].address },
		});
		const options = getAllByTestId("send-transaction__profile-select");

		expect((options[0] as HTMLOptionElement).selected).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it("should select recipient", () => {
		const senderList = [
			{
				address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				walletName: "My Wallet",
				avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
			},
		];
		const contactList = [
			{
				address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				walletName: "My Wallet",
				avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
			},
		];

		const { getByTestId, getAllByTestId, container } = render(
			<SendTransactionForm networks={networks} senderList={senderList} contactList={contactList} />,
		);
		fireEvent.change(getByTestId("send-transaction__select-recipient"), {
			target: { value: contactList[0].address },
		});
		const options = getAllByTestId("send-transaction__profile-select");

		expect((options[1] as HTMLOptionElement).selected).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it("should set available amount", async () => {
		const { getByTestId, container } = render(<SendTransactionForm maxAvailableAmount={100} />);
		const sendAll = getByTestId("send-transaction__send-all");
		const amountInput = getByTestId("send-transaction__amount-input");
		await act(async () => {
			fireEvent.click(sendAll);
		});

		expect(amountInput).toHaveValue(100);
		expect(container).toMatchSnapshot();
	});

	it("should show add recipient button when recipient and amount are set", async () => {
		const contactList = [
			{
				address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				walletName: "My Wallet",
				avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
			},
		];

		const { getByTestId } = render(<SendTransactionForm contactList={contactList} maxAvailableAmount={100} />);

		const sendAll = getByTestId("send-transaction__send-all");
		const recipientSelect = getByTestId("send-transaction__select-recipient");

		fireEvent.change(recipientSelect, { target: { value: contactList[0].address } });
		await act(async () => {
			fireEvent.click(sendAll);
		});

		const addedRecipientBtn = getByTestId("send-transaction__add-recipient");
		expect(addedRecipientBtn).toBeTruthy();
	});

	it("should add recipient", async () => {
		const contactList = [
			{
				address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				walletName: "My Wallet",
				avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
			},
		];

		const { getByTestId } = render(<SendTransactionForm contactList={contactList} maxAvailableAmount={100} />);

		const sendAll = getByTestId("send-transaction__send-all");
		const recipientSelect = getByTestId("send-transaction__select-recipient");

		fireEvent.change(recipientSelect, { target: { value: contactList[0].address } });
		await act(async () => {
			fireEvent.click(sendAll);
		});

		const addedRecipientBtn = getByTestId("send-transaction__add-recipient");
		await act(async () => {
			fireEvent.click(addedRecipientBtn);
		});
		const addedRecipient = getByTestId("recipient-list__recipient-list-item");
		expect(addedRecipient).toBeTruthy();
	});

	it("should add secondary recipient", async () => {
		const contactList = [
			{
				address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				walletName: "My Wallet",
				avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
			},
			{
				address: "BFJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				walletName: "My Wallet",
				avatarId: "BFJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				formatted: "My Wallet 2 FJKDSALJFKASL...SAJFKLASJKDFJ",
			},
		];

		const { getByTestId, getAllByTestId } = render(
			<SendTransactionForm contactList={contactList} maxAvailableAmount={100} />,
		);

		const sendAll = getByTestId("send-transaction__send-all");
		const recipientSelect = getByTestId("send-transaction__select-recipient");
		// 1st recipient
		fireEvent.change(recipientSelect, { target: { value: contactList[0].address } });
		await act(async () => {
			fireEvent.click(sendAll);
		});

		const addedRecipientBtn1 = getByTestId("send-transaction__add-recipient");
		await act(async () => {
			fireEvent.click(addedRecipientBtn1);
		});

		// 2nd recipient
		fireEvent.change(recipientSelect, { target: { value: contactList[1].address } });
		await act(async () => {
			fireEvent.click(sendAll);
		});

		const addedRecipientBtn2 = getByTestId("send-transaction__add-recipient");
		await act(async () => {
			fireEvent.click(addedRecipientBtn2);
		});

		const addedRecipients = getAllByTestId("recipient-list__recipient-list-item");
		expect(addedRecipients).toHaveLength(2);
	});

	it("should remove added recipient", async () => {
		const contactList = [
			{
				address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				walletName: "My Wallet",
				avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
				formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
			},
		];

		const { getByTestId, queryByText } = render(
			<SendTransactionForm contactList={contactList} maxAvailableAmount={100} />,
		);

		const sendAll = getByTestId("send-transaction__send-all");
		const recipientSelect = getByTestId("send-transaction__select-recipient");
		// 1st recipient
		fireEvent.change(recipientSelect, { target: { value: contactList[0].address } });
		await act(async () => {
			fireEvent.click(sendAll);
		});

		const addedRecipientBtn = getByTestId("send-transaction__add-recipient");
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

	it("should emit goBack button click", async () => {
		const networks = [
			{
				value: "ark",
				label: "Ark Ecosystem",
				icon: "Ark",
			},
		];
		// Select network to enable buttons
		const fn = jest.fn();
		const { getByTestId, container } = render(<SendTransactionForm onBack={fn} networks={networks} />);
		fireEvent.change(getByTestId("send-transaction__network-select"), { target: { value: "ark" } });
		const backBtn = getByTestId("send-transaction-click-back");
		act(() => {
			fireEvent.click(backBtn);
		});

		expect(container).toMatchSnapshot();
		expect(fn).toBeCalled();
	});

	it("should submit form", async () => {
		const networks = [
			{
				value: "ark",
				label: "Ark Ecosystem",
				icon: "Ark",
			},
		];
		// Select network to enable buttons
		const fn = jest.fn();
		const { getByTestId, container } = render(<SendTransactionForm onSubmit={fn} networks={networks} />);
		fireEvent.change(getByTestId("send-transaction__network-select"), { target: { value: "ark" } });
		const submit = getByTestId("send-transaction-click-submit");
		await act(async () => {
			fireEvent.click(submit);
		});

		expect(container).toMatchSnapshot();
		expect(fn).toBeCalled();
	});

	it("should not call onSubmit callback if not provided", async () => {
		const networks = [
			{
				value: "ark",
				label: "Ark Ecosystem",
				icon: "Ark",
			},
		];
		// Select network to enable buttons
		const fn = jest.fn();
		const { getByTestId, container } = render(<SendTransactionForm networks={networks} />);
		fireEvent.change(getByTestId("send-transaction__network-select"), { target: { value: "ark" } });
		const submit = getByTestId("send-transaction-click-submit");
		await act(async () => {
			fireEvent.click(submit);
		});

		expect(container).toMatchSnapshot();
		expect(fn).not.toHaveBeenCalled();
	});

	it("should not call onBack callback if not provided", async () => {
		const networks = [
			{
				value: "ark",
				label: "Ark Ecosystem",
				icon: "Ark",
			},
		];
		// Select network to enable buttons
		const fn = jest.fn();
		const { getByTestId, container } = render(<SendTransactionForm networks={networks} />);
		fireEvent.change(getByTestId("send-transaction__network-select"), { target: { value: "ark" } });
		const back = getByTestId("send-transaction-click-back");
		await act(async () => {
			fireEvent.click(back);
		});

		expect(container).toMatchSnapshot();
		expect(fn).not.toHaveBeenCalled();
	});
});
