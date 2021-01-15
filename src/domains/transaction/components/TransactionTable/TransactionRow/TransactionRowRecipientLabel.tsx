import { DelegateMapper, ExtendedTransactionData, ReadOnlyWallet, VoteData } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { useTransactionTypes } from "domains/transaction/hooks/use-transaction-types";
import React, { useEffect, useState } from "react";

type Props = {
	transaction?: ExtendedTransactionData;
	type: string;
	recipient: string;
	walletName?: string;
};

const RecipientLabel = ({ type }: { type: string }) => {
	const { getLabel } = useTransactionTypes();
	return (
		<span data-testid="TransactionRowRecipientLabel" className="font-semibold text-theme-text">
			{getLabel(type)}
		</span>
	);
};

const VoteCombinationLabel = ({ votes, unvotes }: { votes: string[]; unvotes: string[] }) => (
	<span data-testid="TransactionRowVoteCombinationLabel" className="space-x-1">
		<span className="inline-flex max-w-72">
			<RecipientLabel type="vote" />
			{votes.length > 1 && (
				<span className="ml-1 font-semibold text-theme-secondary-500 dark:text-theme-secondary-700">
					{votes.length}
				</span>
			)}
		</span>

		<span>/</span>

		<span>
			<RecipientLabel type="unvote" />
			{unvotes.length > 1 && (
				<span className="ml-1 font-semibold text-theme-secondary-500 dark:text-theme-secondary-700">
					{unvotes.length}
				</span>
			)}
		</span>
	</span>
);

const VoteLabel = ({ delegates, isUnvote }: { delegates: ReadOnlyWallet[]; isUnvote?: boolean }) => (
	<span data-testid="TransactionRowVoteLabel">
		<RecipientLabel type={isUnvote ? "unvote" : "vote"} />
		<span className="pl-2 ml-2 font-semibold border-l truncate text-theme-primary-600 border-theme-secondary-300 dark:border-theme-secondary-800">
			{delegates[0]?.username()}
		</span>
		{delegates.length > 1 && (
			<span className="ml-1 font-semibold text-theme-secondary-500 dark:text-theme-secondary-700">
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
				<span className="ml-1 font-semibold text-theme-secondary-500 dark:text-theme-secondary-700">
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
