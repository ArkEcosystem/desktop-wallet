/* eslint-disable @typescript-eslint/require-await */
import { fireEvent,render } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import { RecipientList } from "./";

describe("SendTransactionForm", () => {
	const recipients = [
		{
			address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "Recipient 1",
			amount: "100",
			assetSymbol: "ARK",
		},
		{
			address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "Recipient 2",
			isMultisig: true,
			amount: "100",
			assetSymbol: "ARK",
		},
		{
			address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "Recipient 3",
			isInArkNetwork: true,
			amount: "100",
			assetSymbol: "ARK",
		},
		{
			address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "Recipient 4",
			isInArkNetwork: true,
			amount: "100",
			assetSymbol: "ARK",
		},
	];

	it("should render editable", () => {
		const { container } = render(<RecipientList recipients={recipients} isEditable={true} assetSymbol="ARK" />);
		expect(container).toMatchSnapshot();
	});

	it("should render non-editable", () => {
		const { container } = render(<RecipientList recipients={recipients} isEditable={false} assetSymbol="ARK" />);
		expect(container).toMatchSnapshot();
	});

	it("should call onRemove callback to remove recipient", async () => {
		const fn = jest.fn();

		const { getAllByTestId } = render(
			<RecipientList onRemove={fn} recipients={recipients} isEditable={true} assetSymbol="ARK" />,
		);

		const removeBtn = getAllByTestId("recipient-list__remove-recipient");
		expect(removeBtn[0]).toBeTruthy();
		await act(async () => {
			fireEvent.click(removeBtn[0]);
		});

		expect(fn).toBeCalled();
	});

	it("should not call onRemove callback if not provided", async () => {
		const fn = jest.fn();

		const { getAllByTestId } = render(
			<RecipientList recipients={recipients} isEditable={true} assetSymbol="ARK" />,
		);

		const removeBtn = getAllByTestId("recipient-list__remove-recipient");
		expect(removeBtn[0]).toBeTruthy();
		await act(async () => {
			fireEvent.click(removeBtn[0]);
		});

		expect(fn).not.toBeCalled();
	});
});
