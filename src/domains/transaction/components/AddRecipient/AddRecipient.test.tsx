/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "testing-library";

import { AddRecipient } from "./AddRecipient";

let profile: Profile;

describe("AddRecipient", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render", () => {
		const { container } = render(
			<AddRecipient profile={profile} assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render without recipients", () => {
		const { container } = render(<AddRecipient profile={profile} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with multiple recipients tab", () => {
		const { container } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				isSingleRecipient={false}
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should select recipient", async () => {
		const { getByTestId, getAllByTestId } = render(
			<AddRecipient profile={profile} assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		await act(async () => {
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		await act(async () => {
			fireEvent.click(firstAddress);
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		const selectedAddressValue = profile.contacts().values()[0].addresses().values()[0].address();

		expect(getByTestId("SelectRecipient__input")).toHaveValue(selectedAddressValue);
	});

	it("should set available amount", async () => {
		const { getByTestId, container } = render(
			<AddRecipient profile={profile} assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} />,
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
			<AddRecipient profile={profile} assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} />,
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
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				isSingleRecipient={false}
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
			fireEvent.click(getByTestId("add-recipient__send-all"));
		});

		await waitFor(() => {
			const addedRecipientBtn = getByTestId("add-recipient__add-btn");
			expect(addedRecipientBtn).toBeTruthy();
		});
	});

	it("should add two recipients in multiple tab", async () => {
		const { getByTestId, getAllByTestId } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				isSingleRecipient={false}
			/>,
		);

		const sendAll = getByTestId("add-recipient__send-all");
		act(() => {
			fireEvent.click(sendAll);
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
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
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
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

	it("should add and remove recipient", async () => {
		const { getByTestId, getAllByTestId, queryByText } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				isSingleRecipient={false}
			/>,
		);

		const sendAll = getByTestId("add-recipient__send-all");
		await act(async () => {
			fireEvent.click(sendAll);
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		await waitFor(
			() => {
				expect(getByTestId("modal__inner")).toBeTruthy();
			},
			{ timeout: 2000 },
		);

		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];
		await act(async () => {
			fireEvent.click(firstAddress);
		});

		await act(async () => {
			fireEvent.click(getByTestId("add-recipient__add-btn"));
		});

		const removeBtn = getAllByTestId("recipient-list__remove-recipient");
		expect(removeBtn[0]).toBeTruthy();
		await act(async () => {
			fireEvent.click(removeBtn[0]);
		});

		const addedRecipient = queryByText("Recipient wallet");
		expect(addedRecipient).toBeFalsy();
	});
});
