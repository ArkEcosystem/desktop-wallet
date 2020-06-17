import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import React, { useState } from "react";

type DashboardProps = {
	transactions?: any;
	wallets?: any;
	networks?: any;
};

export const Dashboard = ({ transactions, wallets, networks }: DashboardProps) => {
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
			<div className="bg-theme-neutral-200">
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
