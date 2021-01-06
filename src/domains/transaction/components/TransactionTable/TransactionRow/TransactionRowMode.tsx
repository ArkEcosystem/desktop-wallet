import { Contracts } from "@arkecosystem/platform-sdk";
import { TransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";
import { Size } from "types";

import { TransactionRowRecipientIcon } from "./TransactionRowRecipientIcon";

type Props = {
	type: string;
	isSent: boolean;
	recipient: string;
	recipients?: Contracts.MultiPaymentRecipient[];
	circleShadowColor?: string;
	iconSize?: Size;
};

export const BaseTransactionRowMode = ({
	type,
	isSent,
	recipient,
	recipients,
	circleShadowColor,
	iconSize = "lg",
}: Props) => {
	const { t } = useTranslation();

	const tooltipContent = isSent ? t("TRANSACTION.SENT") : t("TRANSACTION.RECEIVED");
	const modeIconName = isSent ? "Sent" : "Received";

	const modeCircleStyle = isSent
		? "border-theme-danger-100 text-theme-danger-400 dark:border-theme-danger-400"
		: "border-theme-success-200 text-theme-success-600 dark:border-theme-success-600";

	return (
		<div data-testid="TransactionRowMode" className="flex items-center -space-x-1">
			<Tooltip content={tooltipContent}>
				<Circle size={iconSize} className={modeCircleStyle} shadowColor={circleShadowColor}>
					<Icon data-testid={`TransactionRowMode__${modeIconName}`} name={modeIconName} />
				</Circle>
			</Tooltip>
			<TransactionRowRecipientIcon
				size={iconSize}
				recipient={recipient}
				type={type}
				className={`bg-theme-background font-semibold ${modeCircleStyle}`}
				circleShadowColor={circleShadowColor}
			/>
		</div>
	);
};

export const TransactionRowMode = ({
	iconSize = "lg",
	transaction,
	circleShadowColor,
}: {
	iconSize?: Size;
	transaction: ExtendedTransactionData | TransactionData;
	circleShadowColor?: string;
}) => (
	<BaseTransactionRowMode
		iconSize={iconSize}
		circleShadowColor={circleShadowColor}
		isSent={transaction.isSent()}
		type={transaction.type()}
		recipient={transaction.recipient()}
		recipients={transaction.recipients()}
	/>
);
