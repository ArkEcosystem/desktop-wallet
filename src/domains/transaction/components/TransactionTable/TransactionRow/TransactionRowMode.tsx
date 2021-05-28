import { Contracts } from "@arkecosystem/platform-sdk";
import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import { Size } from "types";

import { TransactionRowRecipientIcon } from "./TransactionRowRecipientIcon";

interface Props {
	type: string;
	isSent: boolean;
	recipient: string;
	iconSize?: Size;
}

export const BaseTransactionRowMode = ({ type, isSent, recipient, iconSize = "lg" }: Props) => {
	const { t } = useTranslation();

	const tooltipContent = isSent ? t("TRANSACTION.SENT") : t("TRANSACTION.RECEIVED");
	const modeIconName = isSent ? "Sent" : "Received";

	const modeCircleStyle = isSent
		? "border-theme-danger-100 text-theme-danger-400 dark:border-theme-danger-400"
		: "border-theme-success-200 text-theme-success-600 dark:border-theme-success-600";

	const shadowClasses =
		"ring-theme-background group-hover:ring-theme-secondary-100 group-hover:bg-secondary-100 dark:group-hover:ring-black dark:group-hover:bg-black";

	return (
		<div data-testid="TransactionRowMode" className="flex items-center -space-x-1">
			<Tooltip content={tooltipContent}>
				<Circle size={iconSize} className={cn(shadowClasses, modeCircleStyle)}>
					<Icon data-testid={`TransactionRowMode__${modeIconName}`} name={modeIconName} />
				</Circle>
			</Tooltip>

			<TransactionRowRecipientIcon size={iconSize} recipient={recipient} type={type} />
		</div>
	);
};

export const TransactionRowMode = ({
	iconSize = "lg",
	transaction,
}: {
	iconSize?: Size;
	transaction: DTO.ExtendedTransactionData | Contracts.TransactionData;
}) => (
	<BaseTransactionRowMode
		iconSize={iconSize}
		isSent={transaction.isSent()}
		type={transaction.type()}
		recipient={transaction.recipient()}
	/>
);
