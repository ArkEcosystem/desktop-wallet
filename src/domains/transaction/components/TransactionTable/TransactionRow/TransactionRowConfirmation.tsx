import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionStatus } from "../TransactionTable.models";

type Props = {
	isSignaturePending?: boolean;
	transaction: DTO.ExtendedTransactionData;
};

const getStatus = (isConfirmed: boolean, isSignaturePending?: boolean): TransactionStatus => {
	if (isSignaturePending) {
		return "actionRequired";
	}

	if (isConfirmed) {
		return "confirmed";
	}

	return "pending";
};

interface StatusInfo {
	iconName: string;
	iconClassName: string;
	tooltipContent: string;
}

const statusInfo: { [key in TransactionStatus]: StatusInfo } = {
	confirmed: {
		iconName: "StatusOk",
		iconClassName: "text-theme-success-600",
		tooltipContent: "TRANSACTION.CONFIRMATIONS_COUNT",
	},
	pending: {
		iconName: "StatusPending",
		iconClassName: "text-theme-warning-600",
		tooltipContent: "TRANSACTION.CONFIRMATIONS_COUNT_PENDING",
	},
	actionRequired: {
		iconName: "Edit",
		iconClassName: "text-theme-danger-400",
		tooltipContent: "TRANSACTION.ACTION_REQUIRED",
	},
};

export const TransactionRowConfirmation = ({ transaction, isSignaturePending }: Props) => {
	const { t } = useTranslation();

	const status = getStatus(transaction?.isConfirmed(), isSignaturePending);
	const { iconClassName, iconName, tooltipContent } = statusInfo[status];

	return (
		<Tooltip content={t(tooltipContent, { count: transaction?.confirmations()?.toNumber() })}>
			<div data-testid="TransactionRowConfirmation" className="inline-flex p-1 align-middle">
				<Icon
					data-testid={`TransactionRowConfirmation__${status}`}
					name={iconName}
					className={iconClassName}
					width={22}
					height={22}
				/>
			</div>
		</Tooltip>
	);
};
