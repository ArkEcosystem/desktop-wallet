/* eslint-disable @typescript-eslint/require-await */
import { contacts } from "domains/contact/data";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

import { AddRecipient } from "./AddRecipient";

describe("AddRecipient", () => {
	it("should render", () => {
		const { container } = render(<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} />);
		expect(container).toMatchSnapshot();
	});

	it("should render without recipients", () => {
		const { container } = render(<AddRecipient />);
		expect(container).toMatchSnapshot();
	});

	it("should render with multiple recipients tab", () => {
		const { container } = render(
			<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} isSingleRecipient={false} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should select recipient", async () => {
		const { getByTestId, getAllByTestId } = render(
			<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} contacts={contacts} />,
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
		const selectedAddressValue = contacts[0]?.addresses()[0]?.address;
		expect(getByTestId("SelectRecipient__input")).toHaveValue(selectedAddressValue);
	});

	it("should set available amount", async () => {
		const { getByTestId, container } = render(
			<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} />,
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
		const { getByTestId } = render(<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} />);
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
				isSingleRecipient={false}
				contacts={contacts}
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
	it("should add and remove recipient", async () => {
		const { getByTestId, getAllByTestId, queryByText } = render(
			<AddRecipient
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				isSingleRecipient={false}
				contacts={contacts}
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
