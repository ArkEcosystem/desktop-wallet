import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { TransactionDetail, TransactionType } from "domains/transaction/components/TransactionDetail";
import { VoteList } from "domains/vote/components/VoteList";
import React from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

interface TransactionVotesProperties {
	isLoading: boolean;
	votes: Contracts.IReadOnlyWallet[];
	unvotes: Contracts.IReadOnlyWallet[];
}

export const TransactionVotes = ({ isLoading, votes, unvotes }: TransactionVotesProperties) => {
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

	const getTransactionType = () => {
		if (votes.length > 0 && unvotes.length > 0) {
			return "voteCombination";
		}

		return votes.length > 0 ? "vote" : "unvote";
	};

	return (
		<>
			<TransactionType type={getTransactionType()} />

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
