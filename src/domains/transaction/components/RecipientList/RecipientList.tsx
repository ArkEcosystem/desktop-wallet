import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import React from "react";

import {
	RecipientList as RecipientListProps,
	RecipientListItem as RecipientListItemProps,
} from "./RecipientList.models";

const RecipientListItem = ({
	amount,
	address,
	walletName,
	assetSymbol,
	onRemove,
	isEditable,
}: RecipientListItemProps) => (
	<tr className="border-b border-theme-neutral-200" data-testid="recipient-list__recipient-list-item">
		<td className="w-12 py-4">
			<Circle avatarId="test" size="small" />
		</td>
		<td>
			<Address address={address} walletName={walletName} />
		</td>

		<td className="font-bold text-right text-theme-neutral-800">
			{amount} {assetSymbol}
		</td>
		{isEditable && (
			<td className="w-16 text-right">
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
		{ Header: "Avatar", className: "invisible w-2" },
		{ Header: "Address" },
		{ Header: "Amount", className: "float-right" },
	];

	if (isEditable) columns.push({ Header: "Action", className: "invisible" });

	return (
		<div className="pt-2">
			<Table columns={columns} data={recipients}>
				{(recipient: RecipientListItemProps) => (
					<RecipientListItem
						assetSymbol={assetSymbol}
						amount={recipient.amount}
						address={recipient.address}
						walletName={recipient.walletName}
						onRemove={() => onRemoveRecipient(recipient?.address)}
						isEditable={isEditable}
					/>
				)}
			</Table>
		</div>
	);
};

RecipientList.defaultProps = {
	recipients: [],
	isEditable: false,
};
