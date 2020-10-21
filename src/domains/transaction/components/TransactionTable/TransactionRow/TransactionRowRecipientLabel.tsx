import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	transaction?: ExtendedTransactionData;
	type: string;
	recipient: string;
	walletName?: string;
};

const RecipientLabel = ({ type }: { type: string }) => (
	<span data-testid="TransactionRowRecipientLabel" className="font-semibold text-theme-text">
		{type}
	</span>
);

export const BaseTransactionRowRecipientLabel = ({ transaction, type, recipient, walletName }: Props) => {
	const { t } = useTranslation();

	const transactionLabel: Record<string, string> = {
		transfer: t("TRANSACTION.TRANSACTION_TYPES.TRANSFER"),
		secondSignature: t("TRANSACTION.TRANSACTION_TYPES.SECOND_SIGNATURE"),
		delegateRegistration: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_REGISTRATION"),
		vote: t("TRANSACTION.TRANSACTION_TYPES.VOTE"),
		unvote: t("TRANSACTION.TRANSACTION_TYPES.UNVOTE"),
		multiSignature: t("TRANSACTION.TRANSACTION_TYPES.MULTI_SIGNATURE"),
		ipfs: t("TRANSACTION.TRANSACTION_TYPES.IPFS"),
		multiPayment: t("TRANSACTION.TRANSACTION_TYPES.MULTI_PAYMENT"),
		delegateResignation: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_RESIGNATION"),
		htlcLock: t("TRANSACTION.TRANSACTION_TYPES.HTLC_LOCK"),
		htlcClaim: t("TRANSACTION.TRANSACTION_TYPES.HTLC_CLAIM"),
		htlcRefund: t("TRANSACTION.TRANSACTION_TYPES.HTLC_REFUND"),
		entityRegistration: t("TRANSACTION.TRANSACTION_TYPES.ENTITY_REGISTRATION"),
		entityResignation: t("TRANSACTION.TRANSACTION_TYPES.ENTITY_RESIGNATION"),
		entityUpdate: t("TRANSACTION.TRANSACTION_TYPES.ENTITY_UPDATE"),
		delegateEntityRegistration: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_ENTITY_REGISTRATION"),
		delegateEntityResignation: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_ENTITY_RESIGNATION"),
		delegateEntityUpdate: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_ENTITY_UPDATE"),
		legacyBusinessRegistration: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BUSINESS_REGISTRATION"),
		legacyBusinessResignation: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BUSINESS_RESIGNATION"),
		legacyBusinessUpdate: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BUSINESS_UPDATE"),
		legacyBridgechainRegistration: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BRIDGECHAIN_REGISTRATION"),
		legacyBridgechainResignation: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BRIDGECHAIN_RESIGNATION"),
		legacyBridgechainUpdate: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BRIDGECHAIN_UPDATE"),
	};

	if (type === "transfer") {
		return <Address walletName={walletName} address={recipient} />;
	}

	if (transaction?.isMultiPayment()) {
		return (
			<>
				<RecipientLabel type={transactionLabel.multiPayment} />
				<span className="ml-1 font-semibold text-theme-neutral-500">{transaction?.recipients().length}</span>
			</>
		);
	}

	if (transaction?.isBusinessEntityRegistration()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION")} />;
	}

	if (transaction?.isBusinessEntityResignation()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_RESIGNATION")} />;
	}

	if (transaction?.isBusinessEntityUpdate()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_UPDATE")} />;
	}

	if (transaction?.isProductEntityRegistration()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_REGISTRATION")} />;
	}

	if (transaction?.isProductEntityResignation()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_RESIGNATION")} />;
	}

	if (transaction?.isProductEntityUpdate()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_UPDATE")} />;
	}

	if (transaction?.isPluginEntityRegistration()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_REGISTRATION")} />;
	}

	if (transaction?.isPluginEntityResignation()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_RESIGNATION")} />;
	}

	if (transaction?.isPluginEntityUpdate()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_UPDATE")} />;
	}

	if (transaction?.isModuleEntityRegistration()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_REGISTRATION")} />;
	}

	if (transaction?.isModuleEntityResignation()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_RESIGNATION")} />;
	}

	if (transaction?.isModuleEntityUpdate()) {
		return <RecipientLabel type={t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_UPDATE")} />;
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
		transaction={transaction}
		type={transaction.type()}
		recipient={transaction.recipient()}
		walletName={walletName}
	/>
);
