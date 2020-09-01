import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Icon } from "app/components/Icon";
import React from "react";

import { TransactionStatus } from "../TransactionTable.models";

type Props = {
	isSignaturePending?: boolean;
	transaction: ExtendedTransactionData;
};

// TODO: Replace by sdk
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
	const status = React.useMemo(() => getStatus(transaction?.isConfirmed(), isSignaturePending), [
		transaction,
		isSignaturePending,
	]);

	const tooltipContent = React.useMemo(
		() => (status === "actionRequired" ? "Action Required" : `${transaction?.confirmations()} confirmations`),
		[transaction, status],
	);

	const iconName = {
		confirmed: "Ok",
		pending: "StatusClock",
		actionRequired: "Edit",
	};

	const iconStyle = {
		confirmed: "text-theme-success",
		pending: "text-theme-warning",
		actionRequired: "text-theme-danger-400",
	};

	return (
		<Tippy content={tooltipContent}>
			<div data-testid="TransactionRowConfirmation" className="inline-flex p-1 align-middle">
				<Icon
					data-testid={`TransactionRowConfirmation__${status}`}
					name={iconName[status]}
					className={iconStyle[status]}
				/>
			</div>
		</Tippy>
	);
};
