import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import React from "react";

import { TransactionStatus } from "../TransactionTable.models";

type Props = {
	isSignaturePending?: boolean;
	transaction: ExtendedTransactionData;
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

export const TransactionRowConfirmation = ({ transaction, isSignaturePending }: Props) => {
	const status = getStatus(transaction?.isConfirmed(), isSignaturePending);
	const tooltipContent =
		status === "actionRequired" ? "Action Required" : `${transaction?.confirmations()} confirmations`;

	const iconName = {
		confirmed: "StatusOk",
		pending: "StatusPending",
		actionRequired: "Edit",
	};

	const iconStyle = {
		confirmed: "text-theme-success-600",
		pending: "text-theme-warning-600",
		actionRequired: "text-theme-danger-400",
	};

	return (
		<Tooltip content={tooltipContent}>
			<div data-testid="TransactionRowConfirmation" className="inline-flex p-1 align-middle">
				<Icon
					data-testid={`TransactionRowConfirmation__${status}`}
					name={iconName[status]}
					className={iconStyle[status]}
					width={22}
					height={22}
				/>
			</div>
		</Tooltip>
	);
};
