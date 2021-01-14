import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";
import { Size } from "types";

type Props = {
	type: string;
	recipient?: string;
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
		className="border-theme-text text-theme-text dark:border-theme-secondary-600 dark:text-theme-secondary-600"
		{...props}
	>
		{children}
	</Circle>
);

export const TransactionRowRecipientIcon = ({ type, recipient, className, circleShadowColor, size }: Props) => {
	const transactionIcon: Record<string, string> = {
		transfer: "Transfer",
		multiPayment: "Multipayment",
		secondSignature: "Key",
		multiSignature: "Multisig",
		delegateRegistration: "Delegate",
		delegateResignation: "DelegateResigned",
		vote: "Vote",
		unvote: "Unvote",
		voteCombination: "VoteCombination",
		ipfs: "Ipfs",
		htlcLock: "Timelock",
		htlcClaim: "Timelock",
		htlcRefund: "Timelock",
		entityRegistration: "Entity",
		entityResignation: "Entity",
		entityUpdate: "Entity",
		businessEntityRegistration: "Business",
		businessEntityResignation: "Business",
		businessEntityUpdate: "Business",
		productEntityRegistration: "Product",
		productEntityResignation: "Product",
		productEntityUpdate: "Product",
		pluginEntityRegistration: "Plugin",
		pluginEntityResignation: "Plugin",
		pluginEntityUpdate: "Plugin",
		moduleEntityRegistration: "Module",
		moduleEntityResignation: "Module",
		moduleEntityUpdate: "Module",
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

	return (
		<Wrapper shadowColor={circleShadowColor} size={size}>
			<Icon name={transactionIcon[type]} width={22} height={22} />
		</Wrapper>
	);
};

TransactionRowRecipientIcon.defaultProps = {
	size: "lg",
};
