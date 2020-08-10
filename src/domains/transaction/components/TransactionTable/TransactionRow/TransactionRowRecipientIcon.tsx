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
};

const Wrapper = ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
	<Circle
		data-testid="TransactionRowRecipientIcon"
		className={"bg-theme-background border-theme-neutral-900 text-theme-neutral-900"}
		{...props}
	>
		{children}
	</Circle>
);

export const TransactionRowRecipientIcon = ({ type, recipient, recipients, className }: Props) => {
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
		businessRegistration: "Business",
		businessResignation: "Business",
		businessUpdate: "Business",
		bridgechainRegistration: "Bridgechain",
		bridgechainResignation: "Bridgechain",
		bridgechainUpdate: "Bridgechain",
		entityRegistration: "Entity",
		entityResignation: "Entity",
		entityUpdate: "Entity",
	};

	if (type === "transfer") {
		return <Avatar address={recipient} />;
	}

	if (type === "multiPayment") {
		return (
			<Wrapper className={className}>
				<span>{recipients!.length}</span>
			</Wrapper>
		);
	}

	return (
		<Wrapper>
			<Icon name={transactionIcon[type]} />
		</Wrapper>
	);
};

TransactionRowRecipientIcon.defaultProps = {
	recipients: [],
};
