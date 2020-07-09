import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Tippy from "@tippyjs/react";
import { Icon } from "app/components/Icon";
import React from "react";

import { TransactionStatus } from "../TransactionTable.models";

type Props = {
	isSignaturePending?: boolean;
	confirmations: string;
};

// TODO: Replace by sdk
const getStatus = (confirmations: string, isSignaturePending?: boolean): TransactionStatus => {
	if (isSignaturePending) {
		return "actionRequired";
	} else if (BigNumber.make(confirmations).isGreaterThan(51)) {
		return "confirmed";
	} else {
		return "pending";
	}
};

export const TransactionRowConfirmation = ({ confirmations, isSignaturePending }: Props) => {
	const status = React.useMemo(() => getStatus(confirmations, isSignaturePending), [
		confirmations,
		isSignaturePending,
	]);

	const tooltipContent = React.useMemo(
		() => (status === "actionRequired" ? "Action Required" : `${confirmations} confirmations`),
		[confirmations, status],
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
			<div data-testid="TransactionRowConfirmation" className="inline-flex align-middle p-1">
				<Icon
					data-testid={`TransactionRowConfirmation__${status}`}
					name={iconName[status]}
					className={iconStyle[status]}
				/>
			</div>
		</Tippy>
	);
};
