import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import { VoteList } from "domains/vote/components/VoteList";
import React from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

type TransactionVotesProps = {
	isLoading: boolean;
	votes: ReadOnlyWallet[];
	unvotes: ReadOnlyWallet[];
};

export const TransactionVotes = ({ isLoading, votes, unvotes }: TransactionVotesProps) => {
	const { t } = useTranslation();

	if (isLoading) {
		return (
			<div
				data-testid="TransactionVotes__skeleton"
				className="flex justify-between items-center py-6 border-t border-dashed border-theme-secondary-300 dark:border-theme-secondary-800"
			>
				<div className="flex flex-col space-y-2">
					<Skeleton height={14} width="25%" />
					<Skeleton height={16} width="75%" />
				</div>

				<Skeleton circle width={44} height={44} className="mb-1" />
			</div>
		);
	}

	const getTransactionIcon = () => {
		if (votes.length && unvotes.length) {
			return "VoteCombination";
		}

		return votes.length ? "Vote" : "Unvote";
	};

	const getTransactionType = () => {
		if (votes.length && unvotes.length) {
			return t("TRANSACTION.TRANSACTION_TYPES.VOTE_COMBINATION");
		}

		return votes.length ? t("TRANSACTION.TRANSACTION_TYPES.VOTE") : t("TRANSACTION.TRANSACTION_TYPES.UNVOTE");
	};

	return (
		<>
			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				extra={
					<Circle className="border-theme-text" size="lg">
						<Icon name={getTransactionIcon()} width={21} height={21} />
					</Circle>
				}
			>
				{getTransactionType()}
			</TransactionDetail>

			{votes.length > 0 && (
				<TransactionDetail label={t("TRANSACTION.VOTES_COUNT", { count: votes.length })}>
					<VoteList votes={votes} />
				</TransactionDetail>
			)}

			{unvotes.length > 0 && (
				<TransactionDetail label={t("TRANSACTION.UNVOTES_COUNT", { count: unvotes.length })}>
					<VoteList votes={unvotes} />
				</TransactionDetail>
			)}
		</>
	);
};

TransactionVotes.defaultProps = {
	isLoading: false,
	votes: [],
	unvotes: [],
};
