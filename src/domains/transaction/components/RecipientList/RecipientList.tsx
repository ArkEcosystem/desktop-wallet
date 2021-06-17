import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { OriginalButton as Button } from "app/components/Button/OriginalButton";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { Table } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import {
	RecipientList as RecipientListProperties,
	RecipientListItem as RecipientListItemProperties,
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
	tooltipDisabled,
	disableButton,
	showAmount,
}: RecipientListItemProperties) => {
	const { t } = useTranslation();

	if (variant === "condensed") {
		return (
			<tr
				className="border-b border-dashed last:border-b-0 border-theme-secondary-300 dark:border-theme-secondary-800"
				data-testid="recipient-list__recipient-list-item"
			>
				<td className="w-12 py-4">
					<Avatar size="sm" address={address} />
				</td>

				<td className="py-4">
					<div className="max-w-lg">
						<Address address={address} walletName={walletName} />
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

	const isButtonDisabled = disableButton?.(address) || false;

	return (
		<tr
			className="border-b border-dashed last:border-b-0 border-theme-secondary-300 dark:border-theme-secondary-800"
			data-testid="recipient-list__recipient-list-item"
		>
			<td className="py-6 w-14">
				<Avatar address={address} size="lg" />
			</td>

			<td className="py-6">
				<div className="mb-1 text-sm font-semibold text-theme-secondary-500 dark:text-theme-secondary-700">
					<span>{t(label || "COMMON.RECIPIENT_#", { count: listIndex! + 1 })}</span>
				</div>
				<div className="max-w-sm">
					<Address address={address} walletName={walletName} />
				</div>
			</td>

			{showAmount && (
				<td className="py-6">
					<div className="mb-1 text-sm font-semibold text-right text-theme-secondary-500 dark:text-theme-secondary-700">
						<span>{t("COMMON.AMOUNT")}</span>
					</div>
					<div className="font-semibold text-right">
						<Amount ticker={assetSymbol!} value={amount!} />
					</div>
				</td>
			)}

			{isEditable && (
				<td className="w-20 py-6 text-right">
					<Tooltip content={tooltipDisabled} disabled={!isButtonDisabled}>
						<span className="inline-block">
							<Button
								disabled={isButtonDisabled}
								variant="danger"
								onClick={() => !isButtonDisabled && onRemove?.(listIndex!)}
								data-testid="recipient-list__remove-recipient"
							>
								<div className="py-1">
									<Icon name="Trash" />
								</div>
							</Button>
						</span>
					</Tooltip>
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
	tooltipDisabled,
	disableButton,
	onRemove,
}: RecipientListProperties) => {
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
				{(recipient: RecipientListItemProperties, index: number) => (
					<RecipientListItem
						showAmount={showAmount}
						address={recipient.address}
						amount={recipient.amount}
						assetSymbol={assetSymbol}
						isEditable={isEditable}
						label={label}
						listIndex={index}
						variant={variant}
						walletName={recipient.walletName}
						tooltipDisabled={tooltipDisabled}
						disableButton={disableButton}
						onRemove={onRemove}
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
