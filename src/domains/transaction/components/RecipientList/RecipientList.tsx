import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import React from "react";
import { styled } from "twin.macro";

import {
	RecipientList as RecipientListProps,
	RecipientListItem as RecipientListItemProps,
} from "./RecipientList.models";
import { defaultStyle } from "./RecipientList.styles";

const RecipientListWrapper = styled.div`
	${defaultStyle}
`;
const RecipientListItem = ({
	amount,
	address,
	walletName,
	assetSymbol,
	onRemove,
	isEditable,
	listIndex,
}: RecipientListItemProps) => (
	<tr className="border-b border-dotted border-theme-neutral-200" data-testid="recipient-list__recipient-list-item">
		<td className="py-6 w-14">
			<Avatar address="test" />
		</td>
		<td>
			<div className="mb-1 text-sm font-semibold text-theme-neutral">Recipient #{listIndex}</div>
			<Address address={address} walletName={walletName} />
		</td>

		<td>
			<div className="mb-1 text-sm font-semibold text-right text-theme-neutral">Amount</div>
			<div className="font-bold text-right text-theme-neutral-800">
				{amount} {assetSymbol}
			</div>
		</td>
		{isEditable && (
			<td className="w-20 text-right">
				<Button
					variant="plain"
					onClick={() => typeof onRemove === "function" && onRemove(address)}
					data-testid="recipient-list__remove-recipient"
				>
					<div className="py-1">
						<Icon name="Trash" />
					</div>
				</Button>
			</td>
		)}
	</tr>
);

export const RecipientList = ({ recipients, onRemove, assetSymbol, isEditable }: RecipientListProps) => {
	const onRemoveRecipient = (address: string) => {
		if (typeof onRemove === "function") return onRemove(address);
	};
	const columns = [
		{ Header: "Avatar", className: "hidden" },
		{ Header: "Address", className: "hidden" },
		{ Header: "Amount", className: "hidden" },
	];

	if (isEditable) columns.push({ Header: "Action", className: "hidden" });

	return (
		<RecipientListWrapper>
			<Table columns={columns} data={recipients}>
				{(recipient: RecipientListItemProps, index: number) => (
					<RecipientListItem
						assetSymbol={assetSymbol}
						amount={recipient.amount}
						address={recipient.address}
						walletName={recipient.walletName}
						onRemove={() => onRemoveRecipient(recipient?.address)}
						isEditable={isEditable}
						listIndex={index + 1}
					/>
				)}
			</Table>
		</RecipientListWrapper>
	);
};

RecipientList.defaultProps = {
	recipients: [],
	isEditable: false,
};
