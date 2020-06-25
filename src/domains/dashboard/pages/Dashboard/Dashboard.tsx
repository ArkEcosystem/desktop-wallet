import { LineChart } from "app/components/LineChart";
import { PercentageBar } from "app/components/PercentageBar";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import React, { useState } from "react";

type DashboardProps = {
	balances?: any;
	transactions?: any;
	wallets?: any;
	networks?: any;
	portfolioPercentages?: any[];
};

export const Dashboard = ({ transactions, wallets, networks, portfolioPercentages, balances }: DashboardProps) => {
	const [showTransactions, setShowTransactions] = useState(true);
	const [showPortfolio, setShowPortfolio] = useState(true);

	// Wallet controls data
	const filterProperties = {
		visibleTransactionsView: showTransactions,
		visiblePortfolioView: true,
		networks,
		toggleTransactionsView: (isChecked: boolean) => {
			setShowTransactions(isChecked);
		},
		togglePortfolioView: (isChecked: boolean) => {
			setShowPortfolio(isChecked);
		},
	};

	const chartLines = [
		{
			dataKey: "btc",
			label: "BTC",
			color: "warning-600",
		},
		{
			dataKey: "usd",
			label: "USD",
			color: "success-600",
		},
	];

	return (
		<div className="-m-5 bg-theme-neutral-100">
			{showPortfolio && balances && (
				<div className="bg-white p-11 mb-6">
					<h1>Portfolio Chart</h1>
					<div className="pb-20">
						<LineChart height={260} period="22 Jun - 28 Jun" data={balances} lines={chartLines} />
					</div>
					<div className="border-b border-theme-neutral-100 mt-6 mb-4" />
					<div>
						<PercentageBar title="Total portfolio" data={portfolioPercentages} />
					</div>
				</div>
			)}

			<div className="bg-white">
				<Wallets viewType="grid" title="Wallets" wallets={wallets} filterProperties={filterProperties} />
			</div>
			{showTransactions && (
				<div className="mt-5 pt-1 bg-white" data-testid="dashboard__transactions-view">
					<Transactions transactions={transactions} />
				</div>
			)}
		</div>
	);
};
