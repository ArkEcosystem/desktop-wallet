import { Contracts } from "@arkecosystem/platform-sdk";
import { Address } from "app/components/Address";
import React from "react";

type Props = {
	transaction: Contracts.TransactionDataType;
	walletName?: string;
};

export const TransactionRowRecipientLabel = ({ transaction, walletName }: Props) => {
	// TODO: i18n
	const transactionLabel: Record<string, string> = {
		transfer: "Transfer",
		secondSignature: "2nd Signature Creation",
		delegateRegistration: "Delegate Registration",
		vote: "Vote",
		unvote: "Vote",
		multiSignature: "Multisignature Registration",
		ipfs: "IPFS",
		multiPayment: "Multipayment",
		delegateResignation: "Delegate Resignation",
		htlcLock: "Timelock",
		htlcClaim: "Timelock Claim",
		htlcRefund: "Timelock Refund",
		businessRegistration: "Business Registration",
		businessResignation: "Business Resignation",
		businessUpdate: "Business Update",
		bridgechainRegistration: "Bridgechain Registration",
		bridgechainResignation: "Bridgechain Resignation",
		bridgechainUpdate: "Bridgechain Update",
		entityRegistration: "Entity Registration",
		entityResignation: "Entity Resignation",
		entityUpdate: "Entity Update",
	};

	if (transaction?.type() === "transfer") {
		return <Address walletName={walletName} address={transaction?.recipient()} />;
	}

	return (
		<span data-testid="TransactionRowRecipientLabel" className="text-theme-text font-semibold">
			{transactionLabel[transaction?.type()]}
		</span>
	);
};
