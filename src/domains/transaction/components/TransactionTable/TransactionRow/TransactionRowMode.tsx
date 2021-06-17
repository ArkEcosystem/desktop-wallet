import { Contracts } from "@arkecosystem/platform-sdk";
import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Size } from "types";

import { TransactionRowRecipientIcon } from "./TransactionRowRecipientIcon";

interface Props {
	type: string;
	isSent: boolean;
	isReturn?: boolean;
	recipient: string;
	iconSize?: Size;
}

export const BaseTransactionRowMode = ({ type, isSent, isReturn, recipient, iconSize = "lg" }: Props) => {
	const { t } = useTranslation();

	const { modeIconName, tooltipContent, modeCircleStyle } = useMemo(() => {
		if (isReturn) {
			return {
				modeIconName: "Return",
				tooltipContent: t("TRANSACTION.RETURN"),
				modeCircleStyle: "border-theme-success-200 text-theme-success-600 dark:border-theme-success-600",
			};
		}

		if (isSent) {
			return {
				modeIconName: "Sent",
				tooltipContent: t("TRANSACTION.SENT"),
				modeCircleStyle: "border-theme-danger-100 text-theme-danger-400 dark:border-theme-danger-400",
			};
		}

		return {
			modeIconName: "Received",
			tooltipContent: t("TRANSACTION.RECEIVED"),
			modeCircleStyle: "border-theme-success-200 text-theme-success-600 dark:border-theme-success-600",
		};
	}, [isSent, isReturn, t]);

	const shadowClasses =
		"ring-theme-background group-hover:ring-theme-secondary-100 group-hover:bg-secondary-100 dark:group-hover:ring-black dark:group-hover:bg-black";

	return (
		<div data-testid="TransactionRowMode" className="flex items-center -space-x-1">
			<Tooltip content={tooltipContent}>
				<Circle size={iconSize} className={cn(shadowClasses, modeCircleStyle)}>
					<Icon
						data-testid={`TransactionRowMode__${modeIconName}`}
						name={modeIconName}
						width={iconSize === "sm" ? 16 : 20}
						height={iconSize === "sm" ? 16 : 20}
					/>
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
		isReturn={transaction.isReturn()}
		type={transaction.type()}
		recipient={transaction.recipient()}
	/>
);
