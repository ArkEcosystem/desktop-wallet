import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";
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
	address,
	amount,
	assetSymbol,
	isEditable,
	listIndex,
	variant,
	walletName,
	onRemove,
	showAmount,
}: RecipientListItemProps) => {
	const { t } = useTranslation();

	if (variant === "condensed") {
		return (
			<tr
				className="border-b border-dashed last:border-b-0 border-theme-neutral-300"
				data-testid="recipient-list__recipient-list-item"
			>
				<td className="w-12 py-4">
					<Avatar size="sm" address={address} />
				</td>

				<td className="py-4">
					<Address address={address} walletName={walletName} maxChars={!walletName ? 0 : undefined} />
				</td>

				<td className="py-4 text-right">
					{showAmount && (
						<Label color="danger">
							<Amount ticker={assetSymbol!} value={amount} />
						</Label>
					)}
				</td>
			</tr>
		);
	}

	return (
		<tr
			className="border-b border-dashed last:border-b-0 border-theme-neutral-300"
			data-testid="recipient-list__recipient-list-item"
		>
			<td className="py-6 w-14">
				<Avatar address={address} />
			</td>

			<td className="py-6">
				<div className="mb-1 text-sm font-semibold text-theme-neutral">
					{t("COMMON.RECIPIENT_#", { count: listIndex })}
				</div>
				<Address address={address} walletName={walletName} />
			</td>

			<td className="py-6">
				<div className="mb-1 text-sm font-semibold text-right text-theme-neutral">{t("COMMON.AMOUNT")}</div>
				<div className="font-bold text-right text-theme-neutral-800">
					<Amount ticker={assetSymbol!} value={amount} />
				</div>
			</td>

			{isEditable && (
				<td className="w-20 py-6 text-right">
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
};

export const RecipientList = ({
	assetSymbol,
	isEditable,
	recipients,
	variant,
	onRemove,
	showAmount,
}: RecipientListProps) => {
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
						showAmount={showAmount}
						address={recipient.address}
						amount={recipient.amount}
						assetSymbol={assetSymbol}
						isEditable={isEditable}
						listIndex={index + 1}
						variant={variant}
						walletName={recipient.walletName}
						onRemove={() => onRemoveRecipient(recipient?.address)}
					/>
				)}
			</Table>
		</RecipientListWrapper>
	);
};

RecipientList.defaultProps = {
	showAmount: true,
	recipients: [],
	isEditable: false,
};
