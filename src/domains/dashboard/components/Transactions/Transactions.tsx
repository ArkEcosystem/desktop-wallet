import { Contracts } from "@arkecosystem/platform-sdk";
import { Button } from "app/components/Button";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import React from "react";
import { useTranslation } from "react-i18next";

type TransactionsProps = {
	title: string;
	transactions: Contracts.TransactionDataType[];
	moreAction?: any;
	emptyText?: string;
};

export const Transactions = ({ transactions, title, emptyText, fetchMoreAction }: TransactionsProps) => {
	const { t } = useTranslation();

	return (
		<div className="bg-white">
			<div className="text-4xl font-bold">{title}</div>
			{transactions.length > 0 && (
				<div className="pt-8">
					<TransactionTable transactions={transactions} currencyRate="2" />

					<Button
						data-testid="transactions__fetch-more-button"
						variant="plain"
						className="w-full mt-10 mb-5"
						onClick={() => fetchMoreAction()}
					>
						{t("COMMON.VIEW_MORE")}
					</Button>
				</div>
			)}
			{transactions.length === 0 && <div className="text-theme-neutral-dark">{emptyText}</div>}
		</div>
	);
};

Transactions.defaultProps = {
	title: "Transactions History",
	emptyText:
		"This will display the history of your transactions. But you don't have more than one transaction at the moment.",
	transactions: [],
};
