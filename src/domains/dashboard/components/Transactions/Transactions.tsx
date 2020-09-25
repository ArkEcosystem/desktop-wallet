import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
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
	hideHeader,
	onRowClick,
}: TransactionsProps) => {
	const { t } = useTranslation();

	return (
		<div className="bg-white">
			{title && <div className="mb-8 text-4xl font-bold">{title}</div>}
			<div>
				<TransactionTable
					transactions={transactions}
					exchangeCurrency={exchangeCurrency}
					showExplorerLinkColumn={false}
					isLoading={isLoading}
					onRowClick={onRowClick}
					isCompact={isCompact}
					hideHeader={hideHeader}
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
			</div>
			{!isLoading && transactions.length === 0 && <div className="text-theme-neutral-dark">{emptyText}</div>}
		</div>
	);
};

Transactions.defaultProps = {
	emptyText:
		"This will display the history of your transactions. But you don't have more than one transaction at the moment.",
	transactions: [],
};
