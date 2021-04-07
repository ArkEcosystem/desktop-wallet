import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import cn from "classnames";
import React from "react";
import { Size } from "types";

type Props = {
	type: string;
	recipient?: string;
	size?: Size;
};

export const TransactionRowRecipientIcon = ({ type, recipient, size }: Props) => {
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

	const shadowClasses =
		"ring-theme-background bg-theme-background group-hover:ring-theme-secondary-100 group-hover:bg-secondary-100 dark:group-hover:ring-black dark:group-hover:bg-black";

	if (type === "transfer") {
		return <Avatar size={size} address={recipient} className={shadowClasses} />;
	}

	return (
		<Circle
			data-testid="TransactionRowRecipientIcon"
			size={size}
			className={cn(
				"border-theme-text text-theme-text dark:border-theme-secondary-600 dark:text-theme-secondary-600",
				shadowClasses,
			)}
		>
			<Icon name={transactionIcon[type]} width={22} height={22} />
		</Circle>
	);
};

TransactionRowRecipientIcon.defaultProps = {
	size: "lg",
};
