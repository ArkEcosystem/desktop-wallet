import { DelegateMapper, ExtendedTransactionData, ReadOnlyWallet, VoteData } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
	transaction?: ExtendedTransactionData;
	type: string;
	recipient: string;
	walletName?: string;
};

const RecipientLabel = ({ type }: { type: string }) => {
	const { t } = useTranslation();

	const transactionLabel: Record<string, string> = {
		transfer: t("TRANSACTION.TRANSACTION_TYPES.TRANSFER"),
		secondSignature: t("TRANSACTION.TRANSACTION_TYPES.SECOND_SIGNATURE"),
		delegateRegistration: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_REGISTRATION"),
		vote: t("TRANSACTION.TRANSACTION_TYPES.VOTE"),
		unvote: t("TRANSACTION.TRANSACTION_TYPES.UNVOTE"),
		voteCombination: t("TRANSACTION.TRANSACTION_TYPES.VOTE_COMBINATION"),
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
		businessEntityRegistration: t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION"),
		businessEntityResignation: t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_RESIGNATION"),
		businessEntityUpdate: t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_UPDATE"),
		productEntityRegistration: t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_REGISTRATION"),
		productEntityResignation: t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_RESIGNATION"),
		productEntityUpdate: t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_UPDATE"),
		pluginEntityRegistration: t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_REGISTRATION"),
		pluginEntityResignation: t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_RESIGNATION"),
		pluginEntityUpdate: t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_UPDATE"),
		moduleEntityRegistration: t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_REGISTRATION"),
		moduleEntityResignation: t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_RESIGNATION"),
		moduleEntityUpdate: t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_UPDATE"),
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

	return (
		<span data-testid="TransactionRowRecipientLabel" className="font-semibold text-theme-text">
			{transactionLabel[type]}
		</span>
	);
};

const VoteCombinationLabel = ({ votes, unvotes }: { votes: string[]; unvotes: string[] }) => (
	<span className="space-x-1">
		<span className="inline-flex max-w-72">
			<RecipientLabel type="vote" />
			{votes.length > 1 && (
				<span className="ml-1 font-semibold text-theme-neutral-500 dark:text-theme-neutral-700">
					{votes.length}
				</span>
			)}
		</span>

		<span>/</span>

		<span>
			<RecipientLabel type="unvote" />
			{unvotes.length > 1 && (
				<span className="ml-1 font-semibold text-theme-neutral-500 dark:text-theme-neutral-700">
					{unvotes.length}
				</span>
			)}
		</span>
	</span>
);

const VoteLabel = ({ delegates, isUnvote }: { delegates: ReadOnlyWallet[]; isUnvote?: boolean }) => (
	<span>
		<RecipientLabel type={isUnvote ? "unvote" : "vote"} />
		<span className="pl-2 ml-2 font-semibold truncate border-l text-theme-primary-600 border-theme-neutral-300 dark:border-theme-neutral-800">
			{delegates[0]?.username()}
		</span>
		{delegates.length > 1 && (
			<span className="ml-1 font-semibold text-theme-neutral-500 dark:text-theme-neutral-700">
				+{delegates.length - 1}
			</span>
		)}
	</span>
);

export const BaseTransactionRowRecipientLabel = ({ transaction, type, recipient, walletName }: Props) => {
	const [delegates, setDelegates] = useState<{ votes: ReadOnlyWallet[]; unvotes: ReadOnlyWallet[] }>({
		votes: [],
		unvotes: [],
	});

	useEffect(() => {
		if (transaction?.isVote() || transaction?.isUnvote()) {
			setDelegates({
				votes: DelegateMapper.execute(transaction.wallet(), (transaction as VoteData).votes()),
				unvotes: DelegateMapper.execute(transaction.wallet(), (transaction as VoteData).unvotes()),
			});
		}
	}, [transaction]);

	if (type === "transfer") {
		return <Address walletName={walletName} address={recipient} />;
	}

	if (transaction?.isMultiPayment()) {
		return (
			<span>
				<RecipientLabel type="multiPayment" />
				<span className="ml-1 font-semibold text-theme-neutral-500 dark:text-theme-neutral-700">
					{transaction?.recipients().length}
				</span>
			</span>
		);
	}

	if (transaction?.isVoteCombination()) {
		return (
			<VoteCombinationLabel
				votes={(transaction as VoteData)?.votes()}
				unvotes={(transaction as VoteData)?.unvotes()}
			/>
		);
	}

	if (transaction?.isVote() || transaction?.isUnvote()) {
		return (
			<VoteLabel
				delegates={delegates[transaction?.isVote() ? "votes" : "unvotes"]}
				isUnvote={transaction.isUnvote()}
			/>
		);
	}

	return <RecipientLabel type={type} />;
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
