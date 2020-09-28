import { Contracts } from "@arkecosystem/platform-sdk";
import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

import { TransactionRowRecipientIcon } from "./TransactionRowRecipientIcon";

type Props = {
	type: string;
	isSent: boolean;
	recipient: string;
	recipients?: Contracts.MultiPaymentRecipient[];
	circleShadowColor?: string;
};

export const BaseTransactionRowMode = ({ type, isSent, recipient, recipients, circleShadowColor }: Props) => {
	// TODO: i18n
	const tooltipContent = isSent ? "Sent" : "Received";
	const modeIconName = isSent ? "Sent" : "Received";
	const modeCircleStyle = isSent
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
				recipients={recipients}
				recipient={recipient}
				type={type}
				className={`bg-theme-background font-semibold ${modeCircleStyle}`}
				circleShadowColor={circleShadowColor}
			/>
		</div>
	);
};

export const TransactionRowMode = ({
	transaction,
	circleShadowColor,
}: {
	transaction: ExtendedTransactionData;
	circleShadowColor?: string;
}) => (
	<BaseTransactionRowMode
		circleShadowColor={circleShadowColor}
		isSent={transaction.isSent()}
		type={transaction.type()}
		recipient={transaction.recipient()}
		recipients={transaction.recipients()}
	/>
);
