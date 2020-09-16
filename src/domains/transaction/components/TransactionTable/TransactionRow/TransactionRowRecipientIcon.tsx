import { Contracts } from "@arkecosystem/platform-sdk";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

type Props = {
	type: string;
	recipient?: string;
	recipients?: Contracts.MultiPaymentRecipient[];
	className?: string;
	circleShadowColor?: string;
};

const Wrapper = ({ children, ...props }: { children: React.ReactNode; className?: string; shadowColor?: string }) => (
	<Circle
		size="lg"
		data-testid="TransactionRowRecipientIcon"
		className={"border-theme-neutral-900 text-theme-neutral-900"}
		{...props}
	>
		{children}
	</Circle>
);

export const TransactionRowRecipientIcon = ({ type, recipient, recipients, className, circleShadowColor }: Props) => {
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
		return <Avatar size="lg" address={recipient} shadowColor={circleShadowColor} />;
	}

	if (type === "multiPayment") {
		return (
			<Wrapper className={className} shadowColor={circleShadowColor}>
				<span>{recipients!.length}</span>
			</Wrapper>
		);
	}

	return (
		<Wrapper shadowColor={circleShadowColor}>
			<Icon name={transactionIcon[type]} />
		</Wrapper>
	);
};

TransactionRowRecipientIcon.defaultProps = {
	recipients: [],
};
