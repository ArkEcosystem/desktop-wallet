import { Contracts } from "@arkecosystem/platform-sdk";
import Tippy from "@tippyjs/react";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

import { TransactionRowRecipientIcon } from "./TransactionRowRecipientIcon";

type Props = {
	transaction: Contracts.TransactionDataType;
};

export const TransactionRowMode = ({ transaction }: Props) => {
	// TODO: i18n
	const tooltipContent = transaction?.isSent() ? "Sent" : "Received";
	const modeIconName = transaction?.isSent() ? "Sent" : "Received";
	const modeCircleStyle = transaction?.isSent()
		? "border-theme-danger-contrast text-theme-danger"
		: "border-theme-success-300 text-theme-success";

	return (
		<div data-testid="TransactionRowMode" className="flex items-center -space-x-1">
			<Tippy content={tooltipContent}>
				<Circle className={modeCircleStyle}>
					<Icon data-testid={`TransactionRowMode__${modeIconName}`} name={modeIconName} />
				</Circle>
			</Tippy>
			<TransactionRowRecipientIcon
				recipients={transaction?.recipients()}
				recipient={transaction?.recipient()}
				type={transaction?.type()}
				className={`bg-theme-background font-semibold ${modeCircleStyle}`}
			/>
		</div>
	);
};
