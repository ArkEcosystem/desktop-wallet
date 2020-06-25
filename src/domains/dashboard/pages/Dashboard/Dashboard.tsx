import { LineChart } from "app/components/LineChart";
import { PercentageBar } from "app/components/PercentageBar";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import React, { useState } from "react";
import tw, { styled } from "twin.macro";

type DashboardProps = {
	balances?: any;
	transactions?: any;
	wallets?: any;
	networks?: any;
	portfolioPercentages?: any[];
};

const Section = styled.div`
	${tw`bg-white py-16 px-13 mt-5`}
`;

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
		<div className="-m-5 -mt-6 pt-1 bg-theme-neutral-100">
			{showPortfolio && balances && (
				<Section>
					<div className="-mb-2 text-3xl font-bold">Portfolio Chart</div>
					<LineChart height={260} period="22 Jun - 28 Jun" data={balances} lines={chartLines} />
					<div className="pt-6 mb-2 border-b border-dotted border-theme-neutral-200" />
					<PercentageBar title="Total portfolio" data={portfolioPercentages} />
				</Section>
			)}

			<Section>
				<Wallets viewType="grid" title="Wallets" wallets={wallets} filterProperties={filterProperties} />
			</Section>
			{showTransactions && (
				<Section data-testid="dashboard__transactions-view">
					<Transactions transactions={transactions} />
				</Section>
			)}
		</div>
	);
};
