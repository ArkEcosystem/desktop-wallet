import { Address } from "app/components/Address";
import React from "react";

type Props = {
	type: string;
	recipient: string;
	walletName?: string;
};

export const TransactionRowRecipientLabel = ({ type, recipient, walletName }: Props) => {
	// TODO: i18n
	const transactionLabel: Record<string, string> = {
		transfer: "Transfer",
		secondSignature: "2nd Signature Creation",
		delegateRegistration: "Delegate Registration",
		vote: "Vote",
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
	};

	if (type === "transfer") {
		return <Address walletName={walletName} address={recipient} />;
	}

	return (
		<span data-testid="TransactionRowRecipientLabel" className="text-theme-text font-semibold">
			{transactionLabel[type]}
		</span>
	);
};
