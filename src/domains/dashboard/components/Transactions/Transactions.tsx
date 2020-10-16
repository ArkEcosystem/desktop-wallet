import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import React from "react";
import { useTranslation } from "react-i18next";

type TransactionsProps = {
	title?: string;
	transactions: ExtendedTransactionData[];
	exchangeCurrency?: string;
	fetchMoreAction?: Function;
	onRowClick?: (row: ExtendedTransactionData) => void;
	emptyText?: string;
	isLoading?: boolean;
	hideHeader?: boolean;
	isCompact?: boolean;
};

export const Transactions = ({
	transactions,
	exchangeCurrency,
	title,
	emptyText,
	fetchMoreAction,
	isLoading,
	isCompact,
	onRowClick,
}: TransactionsProps) => {
	const { t } = useTranslation();

	return (
		<div className="bg-white">
			{title && <div className="mb-8 text-4xl font-bold">{title}</div>}

			<TransactionTable
				transactions={transactions}
				exchangeCurrency={exchangeCurrency}
				hideHeader={!isLoading && transactions.length === 0}
				isLoading={isLoading}
				onRowClick={onRowClick}
				isCompact={isCompact}
			/>

			{transactions.length > 0 && (
				<Button
					data-testid="transactions__fetch-more-button"
					variant="plain"
					className="w-full mt-10 mb-5"
					disabled={isLoading}
					onClick={() => fetchMoreAction && fetchMoreAction()}
				>
					{isLoading ? t("COMMON.LOADING") : t("COMMON.VIEW_MORE")}
				</Button>
			)}

			{!isLoading && transactions.length === 0 && <EmptyBlock className="-mt-5" message={emptyText!} />}
		</div>
	);
};

Transactions.defaultProps = {
	emptyText:
		"This will display the history of your transactions. But you don't have more than one transaction at the moment.",
	transactions: [],
};
