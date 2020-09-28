import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import React from "react";

type Props = {
	type: string;
	recipient: string;
	walletName?: string;
};

export const BaseTransactionRowRecipientLabel = ({ type, recipient, walletName }: Props) => {
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
		entityRegistration: "Entity Registration",
		entityResignation: "Entity Resignation",
		entityUpdate: "Entity Update",
		businessEntityRegistration: "Business Entity Registration",
		businessEntityResignation: "Business Entity Resignation",
		businessEntityUpdate: "Business Entity Update",
		developerEntityRegistration: "Developer Entity Registration",
		developerEntityResignation: "Developer Entity Resignation",
		developerEntityUpdate: "Developer Entity Update",
		corePluginEntityRegistration: "Core Plugin Entity Registration",
		corePluginEntityResignation: "Core Plugin Entity Resignation",
		corePluginEntityUpdate: "Core Plugin Entity Update",
		desktopPluginEntityRegistration: "Desktop Plugin Entity Registration",
		desktopPluginEntityResignation: "Desktop Plugin Entity Resignation",
		desktopPluginEntityUpdate: "Desktop Plugin Entity Update",
		delegateEntityRegistration: "Delegate Entity Registration",
		delegateEntityResignation: "Delegate Entity Resignation",
		delegateEntityUpdate: "Delegate Entity Update",
		legacyBusinessRegistration: "Legacy Business Registration",
		legacyBusinessResignation: "Legacy Business Resignation",
		legacyBusinessUpdate: "Legacy Business Update",
		legacyBridgechainRegistration: "Legacy Bridgechain Registration",
		legacyBridgechainResignation: "Legacy Bridgechain Resignation",
		legacyBridgechainUpdate: "Legacy Bridgechain Update",
	};

	if (type === "transfer") {
		return <Address walletName={walletName} address={recipient} />;
	}

	return (
		<span data-testid="TransactionRowRecipientLabel" className="font-semibold text-theme-text">
			{transactionLabel[type]}
		</span>
	);
};

export const TransactionRowRecipientLabel = ({
	transaction,
	walletName,
}: {
	transaction: ExtendedTransactionData;
	walletName?: string;
}) => (
	<BaseTransactionRowRecipientLabel
		type={transaction.type()}
		recipient={transaction.recipient()}
		walletName={walletName}
	/>
);
