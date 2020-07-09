import Tippy from "@tippyjs/react";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

import { TransactionRowRecipientIcon } from "./TransactionRowRecipientIcon";

type Props = {
	type: string;
	isSent: boolean;
	recipient: string;
	recipients?: { amount: string; address: string }[];
};

export const TransactionRowMode = ({ type, isSent, recipient, recipients }: Props) => {
	// TODO: i18n
	const tooltipContent = isSent ? "Sent" : "Received";
	const modeIconName = isSent ? "Sent" : "Received";
	const modeCircleStyle = isSent
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
				recipients={recipients}
				recipient={recipient}
				type={type}
				className={`bg-theme-background font-semibold ${modeCircleStyle}`}
			/>
		</div>
	);
};
