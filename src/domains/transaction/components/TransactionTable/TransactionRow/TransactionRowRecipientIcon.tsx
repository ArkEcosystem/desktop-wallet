import { Contracts } from "@arkecosystem/platform-sdk";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";
import { Size } from "types";

type Props = {
	type: string;
	recipient?: string;
	recipients?: Contracts.MultiPaymentRecipient[];
	className?: string;
	circleShadowColor?: string;
	size?: Size;
};

const Wrapper = ({
	children,
	size,
	...props
}: {
	children: React.ReactNode;
	className?: string;
	shadowColor?: string;
	size?: Size;
}) => (
	<Circle
		size={size}
		data-testid="TransactionRowRecipientIcon"
		className="border-theme-text text-theme-text dark:border-theme-neutral-600 dark:text-theme-neutral-600"
		{...props}
	>
		{children}
	</Circle>
);

export const TransactionRowRecipientIcon = ({
	type,
	recipient,
	recipients,
	className,
	circleShadowColor,
	size,
}: Props) => {
	const transactionIcon: Record<string, string> = {
		transfer: "Transfer",
		secondSignature: "Key",
		delegateRegistration: "Delegate",
		vote: "Voted",
		unvote: "Voted",
		multiSignature: "Multisig",
		ipfs: "Ipfs",
		multiPayment: "Multisig",
		delegateResignation: "Delegate",
		htlcLock: "StatusClock",
		htlcClaim: "StatusClock",
		htlcRefund: "StatusClock",
		entityRegistration: "Entity",
		entityResignation: "Entity",
		entityUpdate: "Entity",
		businessEntityRegistration: "Business",
		businessEntityResignation: "Business",
		businessEntityUpdate: "Business",
		developerEntityRegistration: "Developer",
		developerEntityResignation: "Developer",
		developerEntityUpdate: "Developer",
		corePluginEntityRegistration: "CorePlugin",
		corePluginEntityResignation: "CorePlugin",
		corePluginEntityUpdate: "CorePlugin",
		desktopPluginEntityRegistration: "DesktopPlugin",
		desktopPluginEntityResignation: "DesktopPlugin",
		desktopPluginEntityUpdate: "DesktopPlugin",
		delegateEntityRegistration: "Delegate",
		delegateEntityResignation: "Delegate",
		delegateEntityUpdate: "Delegate",
		legacyBusinessRegistration: "Business",
		legacyBusinessResignation: "Business",
		legacyBusinessUpdate: "Business",
		legacyBridgechainRegistration: "Bridgechain",
		legacyBridgechainResignation: "Bridgechain",
		legacyBridgechainUpdate: "Bridgechain",
	};

	if (type === "transfer") {
		return <Avatar size={size} address={recipient} shadowColor={circleShadowColor} />;
	}

	if (type === "multiPayment") {
		return (
			<Wrapper className={className} shadowColor={circleShadowColor} size={size}>
				<span>{recipients!.length}</span>
			</Wrapper>
		);
	}

	return (
		<Wrapper shadowColor={circleShadowColor} size={size}>
			<Icon name={transactionIcon[type]} />
		</Wrapper>
	);
};

TransactionRowRecipientIcon.defaultProps = {
	recipients: [],
	size: "lg",
};
