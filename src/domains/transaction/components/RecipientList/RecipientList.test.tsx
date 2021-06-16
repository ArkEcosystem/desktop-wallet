/* eslint-disable @typescript-eslint/require-await */
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render, screen } from "utils/testing-library";

import { RecipientList } from ".";

const recipients = [
	{
		address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 1",
		amount: BigNumber.make("100"),
		assetSymbol: "ARK",
	},
	{
		address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 2",
		isMultisig: true,
		amount: BigNumber.make("100"),
		assetSymbol: "ARK",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 3",
		amount: BigNumber.make("100"),
		assetSymbol: "ARK",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		amount: BigNumber.make("100"),
		assetSymbol: "ARK",
	},
];

describe("RecipientList", () => {
	it("should render editable", () => {
		const { container } = render(<RecipientList recipients={recipients} isEditable={true} assetSymbol="ARK" />);
		expect(container).toMatchSnapshot();
	});

	it("should render condensed variant", () => {
		const { container } = render(
			<RecipientList
				recipients={recipients}
				isEditable={true}
				assetSymbol="ARK"
				variant="condensed"
				normalizeAmount={false}
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render non-editable", () => {
		const { container } = render(<RecipientList recipients={recipients} isEditable={false} assetSymbol="ARK" />);
		expect(container).toMatchSnapshot();
	});

	it("should render without amount column", () => {
		const { container } = render(
			<RecipientList recipients={recipients} isEditable={true} assetSymbol="ARK" showAmount={false} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should conditionally disable remove button", () => {
		const { container } = render(
			<RecipientList
				recipients={recipients}
				disableButton={(address: string) => address === recipients[0].address}
				isEditable={true}
				assetSymbol="ARK"
			/>,
		);

		const removeButtons = screen.getAllByTestId("recipient-list__remove-recipient");

		for (let i = 0; i < removeButtons.length; i++) {
			if (!i) {
				expect(removeButtons[i]).toBeDisabled();
			} else {
				expect(removeButtons[i]).not.toBeDisabled();
			}
		}

		expect(container).toMatchSnapshot();
	});

	it("should call onRemove callback to remove recipient", async () => {
		const onRemove = jest.fn();

		const { getAllByTestId } = render(
			<RecipientList onRemove={onRemove} recipients={recipients} isEditable={true} assetSymbol="ARK" />,
		);

		const removeBtn = getAllByTestId("recipient-list__remove-recipient");
		expect(removeBtn[0]).toBeTruthy();
		await act(async () => {
			fireEvent.click(removeBtn[0]);
		});

		expect(onRemove).toBeCalled();
	});

	it("should not call onRemove callback if not provided", async () => {
		const onRemove = jest.fn();

		const { getAllByTestId } = render(
			<RecipientList recipients={recipients} isEditable={true} assetSymbol="ARK" />,
		);

		const removeBtn = getAllByTestId("recipient-list__remove-recipient");
		expect(removeBtn[0]).toBeTruthy();
		await act(async () => {
			fireEvent.click(removeBtn[0]);
		});

		expect(onRemove).not.toBeCalled();
	});
});
