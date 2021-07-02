/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render, screen } from "utils/testing-library";

import { RecipientList } from ".";

const recipients = [
	{
		address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
		amount: 100,
		assetSymbol: "ARK",
		walletName: "Recipient 1",
	},
	{
		address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		amount: 100,
		assetSymbol: "ARK",
		isMultisig: true,
		walletName: "Recipient 2",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		amount: 100,
		assetSymbol: "ARK",
		walletName: "Recipient 3",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		amount: 100,
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
			<RecipientList recipients={recipients} isEditable={true} assetSymbol="ARK" variant="condensed" />,
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

		for (const [index, removeButton] of removeButtons.entries()) {
			if (!index) {
				expect(removeButton).toBeDisabled();
			} else {
				expect(removeButton).not.toBeDisabled();
			}
		}

		expect(container).toMatchSnapshot();
	});

	it("should call onRemove callback to remove recipient", async () => {
		const onRemove = jest.fn();

		const { getAllByTestId } = render(
			<RecipientList onRemove={onRemove} recipients={recipients} isEditable={true} assetSymbol="ARK" />,
		);

		const removeButton = getAllByTestId("recipient-list__remove-recipient");

		expect(removeButton[0]).toBeTruthy();

		await act(async () => {
			fireEvent.click(removeButton[0]);
		});

		expect(onRemove).toBeCalled();
	});

	it("should not call onRemove callback if not provided", async () => {
		const onRemove = jest.fn();

		const { getAllByTestId } = render(
			<RecipientList recipients={recipients} isEditable={true} assetSymbol="ARK" />,
		);

		const removeButton = getAllByTestId("recipient-list__remove-recipient");

		expect(removeButton[0]).toBeTruthy();

		await act(async () => {
			fireEvent.click(removeButton[0]);
		});

		expect(onRemove).not.toBeCalled();
	});

	it("should render exchange amount", async () => {
		const recipients = [
			{
				address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
				amount: 100,
				assetSymbol: "ARK",
				exchangeAmount: 1,
				exchangeTicker: "USD",
				walletName: "Recipient 1",
			},
		];

		render(<RecipientList recipients={recipients} showAmount={true} isEditable={true} assetSymbol="ARK" />);

		expect(screen.getByText("$1.00")).toBeInTheDocument();
	});
});
