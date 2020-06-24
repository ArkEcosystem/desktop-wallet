import { PercentageBar } from "app/components/PercentageBar";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import React, { useState } from "react";

type DashboardProps = {
	transactions?: any;
	wallets?: any;
	networks?: any;
	portfolioPercentages?: any[];
};

export const Dashboard = ({ transactions, wallets, networks, portfolioPercentages }: DashboardProps) => {
	const [showTransactions, setShowTransactions] = useState(true);

	// Wallet controls data
	const filterProperties = {
		visibleTransactionsView: showTransactions,
		visiblePortfolioView: true,
		networks,
		toggleTransactionsView: (isChecked: boolean) => {
			setShowTransactions(isChecked);
		},
	};

	return (
		<div className="-m-5">
			<div className="m-11">
				<PercentageBar title="Total portfolio" data={portfolioPercentages} />
			</div>
			<div className="bg-theme-neutral-100">
				<Wallets viewType="grid" title="Wallets" wallets={wallets} filterProperties={filterProperties} />
				{showTransactions && (
					<div data-testid="dashboard__transactions-view">
						<Transactions transactions={transactions} />
					</div>
				)}
			</div>
		</div>
	);
};
