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
	label,
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
				className="border-b border-dashed last:border-b-0 border-theme-secondary-300 dark:border-theme-secondary-800"
				data-testid="recipient-list__recipient-list-item"
			>
				<td className="py-4 w-12">
					<Avatar size="sm" address={address} />
				</td>

				<td className="py-4">
					<div className="max-w-lg">
						<Address
							address={address}
							walletName={walletName}
							maxChars={walletName || !showAmount ? 0 : undefined}
						/>
					</div>
				</td>

				{showAmount && (
					<td className="py-4 text-right">
						<Label color="danger">
							<Amount ticker={assetSymbol!} value={amount!} showSign />
						</Label>
					</td>
				)}
			</tr>
		);
	}

	return (
		<tr
			className="border-b border-dashed last:border-b-0 border-theme-secondary-300 dark:border-theme-secondary-800"
			data-testid="recipient-list__recipient-list-item"
		>
			<td className="py-6 w-14">
				<Avatar address={address} size="lg" />
			</td>

			<td className="py-6">
				<div className="mb-1 text-sm font-semibold text-theme-secondary-500">
					<span>
						{label || t("COMMON.RECIPIENT")} #{listIndex}
					</span>
				</div>
				<div className="max-w-sm">
					<Address
						address={address}
						walletName={walletName}
						maxChars={walletName || !showAmount ? 0 : undefined}
					/>
				</div>
			</td>

			{showAmount && (
				<td className="py-6">
					<div className="mb-1 text-sm font-semibold text-right text-theme-secondary-500">
						<span>{t("COMMON.AMOUNT")}</span>
					</div>
					<div className="font-bold text-right text-theme-secondary-800">
						<Amount ticker={assetSymbol!} value={amount!} showSign />
					</div>
				</td>
			)}

			{isEditable && (
				<td className="py-6 w-20 text-right">
					<Button
						variant="danger"
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
	label,
	showAmount,
	onRemove,
}: RecipientListProps) => {
	const onRemoveRecipient = (address: string) => {
		if (typeof onRemove === "function") {
			return onRemove(address);
		}
	};

	const columns = [
		{ Header: "Avatar", className: "hidden" },
		{ Header: "Address", className: "hidden" },
	];

	if (showAmount) {
		columns.push({ Header: "Amount", className: "hidden" });
	}
	if (isEditable) {
		columns.push({ Header: "Action", className: "hidden" });
	}

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
						label={label}
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
