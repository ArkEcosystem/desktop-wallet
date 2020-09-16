import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

import { TransactionRowRecipientIcon } from "./TransactionRowRecipientIcon";

type Props = {
	transaction: ExtendedTransactionData;
	circleShadowColor?: string;
};

export const TransactionRowMode = ({ transaction, circleShadowColor }: Props) => {
	// TODO: i18n
	const tooltipContent = transaction?.isSent() ? "Sent" : "Received";
	const modeIconName = transaction?.isSent() ? "Sent" : "Received";
	const modeCircleStyle = transaction?.isSent()
		? "border-theme-danger-contrast text-theme-danger"
		: "border-theme-success-300 text-theme-success";

	return (
		<div data-testid="TransactionRowMode" className="flex items-center -space-x-1">
			<Tippy content={tooltipContent}>
				<Circle size="lg" className={modeCircleStyle} shadowColor={circleShadowColor}>
					<Icon data-testid={`TransactionRowMode__${modeIconName}`} name={modeIconName} />
				</Circle>
			</Tippy>
			<TransactionRowRecipientIcon
				recipients={transaction?.recipients()}
				recipient={transaction?.recipient()}
				type={transaction?.type()}
				className={`bg-theme-background font-semibold ${modeCircleStyle}`}
				circleShadowColor={circleShadowColor}
			/>
		</div>
	);
};
