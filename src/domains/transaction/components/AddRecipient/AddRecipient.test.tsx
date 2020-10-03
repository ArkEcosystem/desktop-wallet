/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "utils/testing-library";

import { AddRecipient } from "./AddRecipient";

let profile: Profile;

describe("AddRecipient", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render", () => {
		const { container } = render(
			<AddRecipient profile={profile} assetSymbol="ARK" maxAvailableAmount={BigNumber.make(80)} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render without recipients", () => {
		const { container } = render(
			<AddRecipient maxAvailableAmount={BigNumber.ZERO} profile={profile} recipients={undefined} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render with single recipient data", () => {
		const { container, getByTestId } = render(
			<AddRecipient
				maxAvailableAmount={BigNumber.ZERO}
				profile={profile}
				recipients={[
					{
						amount: BigNumber.make(100 * 1e8),
						address: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
					},
				]}
			/>,
		);

		expect(getByTestId("SelectRecipient__input")).toHaveValue("D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");

		expect(container).toMatchSnapshot();
	});

	it("should render with multiple recipients tab", () => {
		const { container } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={BigNumber.make(80)}
				isSingleRecipient={false}
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should set amount", () => {
		const onChange = jest.fn();
		const { getByTestId } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={BigNumber.make(80)}
				onChange={onChange}
			/>,
		);

		act(() => {
			fireEvent.input(getByTestId("add-recipient__amount-input"), {
				target: {
					value: "1.23",
				},
			});
		});

		expect(onChange).toHaveBeenCalledWith([]);

		act(() => {
			fireEvent.input(getByTestId("SelectRecipient__input"), {
				target: {
					value: "bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT",
				},
			});
		});

		expect(onChange).toHaveBeenCalledWith([
			{ amount: expect.any(BigNumber), address: "bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" },
		]);
	});

	it("should select recipient", async () => {
		const { getByTestId, getAllByTestId } = render(
			<AddRecipient profile={profile} assetSymbol="ARK" maxAvailableAmount={BigNumber.make(80)} />,
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
			<AddRecipient profile={profile} assetSymbol="ARK" maxAvailableAmount={BigNumber.make(8 * 1e8)} />,
		);
		const sendAll = getByTestId("add-recipient__send-all");
		const amountInput = getByTestId("add-recipient__amount-input");
		await act(async () => {
			fireEvent.click(sendAll);
		});

		expect(amountInput).toHaveValue("8.00000000");
		expect(container).toMatchSnapshot();
	});

	it("should toggle between single and multiple recipients", async () => {
		const { getByTestId, queryByText } = render(
			<AddRecipient profile={profile} assetSymbol="ARK" maxAvailableAmount={BigNumber.make(80)} />,
		);

		const singleButton = getByTestId("add-recipient-is-single-toggle");
		const multipleButton = getByTestId("add-recipient-is-multiple-toggle");

		const recipientLabel = "Recipient #1";

		expect(queryByText(recipientLabel)).toBeFalsy();

		await act(async () => {
			fireEvent.click(multipleButton);
		});

		expect(queryByText(recipientLabel)).toBeTruthy();

		await act(async () => {
			fireEvent.click(singleButton);
		});

		expect(queryByText(recipientLabel)).toBeFalsy();
	});

	it("should show add recipient button when recipient and amount are set in multipe tab", async () => {
		const { getByTestId, getAllByTestId } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={BigNumber.make(80)}
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
				maxAvailableAmount={BigNumber.make(80)}
				isSingleRecipient={false}
			/>,
		);

		const sendAll = getByTestId("add-recipient__send-all");
		act(() => {
			fireEvent.click(sendAll);
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());
		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		act(() => {
			fireEvent.click(getByTestId("add-recipient__add-btn"));
		});

		await waitFor(() => expect(getAllByTestId("recipient-list__recipient-list-item")).toHaveLength(1));

		// 2nd recipient

		act(() => {
			fireEvent.click(sendAll);
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());
		const secondAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];
		act(() => {
			fireEvent.click(secondAddress);
		});

		act(() => {
			fireEvent.click(getByTestId("add-recipient__add-btn"));
		});

		await waitFor(() => expect(getAllByTestId("recipient-list__recipient-list-item")).toHaveLength(2));
	});

	it("should add and remove recipient", async () => {
		const { getByTestId, getAllByTestId, queryByText } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={BigNumber.make(80)}
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
