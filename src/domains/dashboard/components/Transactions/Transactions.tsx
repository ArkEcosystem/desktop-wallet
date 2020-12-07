import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { EmptyResults } from "app/components/EmptyResults";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import React from "react";
import { useTranslation } from "react-i18next";

type TransactionsProps = {
	transactions: ExtendedTransactionData[];
	exchangeCurrency?: string;
	fetchMoreAction?: Function;
	onRowClick?: (row: ExtendedTransactionData) => void;
	emptyText?: string;
	isLoading?: boolean;
	hideHeader?: boolean;
	isCompact?: boolean;
	isUsingFilters?: boolean;
};

export const Transactions = ({
	transactions,
	exchangeCurrency,
	emptyText,
	fetchMoreAction,
	isLoading,
	isCompact,
	onRowClick,
	isUsingFilters = false,
}: TransactionsProps) => {
	const { t } = useTranslation();

	return (
		<>
			<TransactionTable
				transactions={transactions}
				exchangeCurrency={exchangeCurrency}
				hideHeader={!isLoading && transactions.length === 0}
				isLoading={isLoading}
				skeletonRowsLimit={8}
				onRowClick={onRowClick}
				isCompact={isCompact}
			/>

			{transactions.length > 0 && (
				<Button
					data-testid="transactions__fetch-more-button"
					variant="plain"
					className="mt-10 mb-5 w-full"
					disabled={isLoading}
					onClick={() => fetchMoreAction && fetchMoreAction()}
				>
					{isLoading ? t("COMMON.LOADING") : t("COMMON.VIEW_MORE")}
				</Button>
			)}

			{!isLoading && transactions.length === 0 && !isUsingFilters && (
				<EmptyBlock className="-mt-5">{emptyText}</EmptyBlock>
			)}

			{!isLoading && transactions.length === 0 && isUsingFilters && (
				<EmptyResults
					className="flex-1"
					title={t("COMMON.EMPTY_RESULTS.TITLE")}
					subtitle={t("COMMON.EMPTY_RESULTS.SUBTITLE")}
				/>
			)}
		</>
	);
};

Transactions.defaultProps = {
	emptyText:
		"This will display the history of your transactions. But you don't have more than one transaction at the moment.",
	transactions: [],
};
