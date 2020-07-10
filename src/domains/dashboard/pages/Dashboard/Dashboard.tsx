import { LineChart } from "app/components/LineChart";
import { PercentageBar } from "app/components/PercentageBar";
import { useActiveProfile } from "app/hooks/env";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { balances, portfolioPercentages, transactions, wallets } from "../../data";

type DashboardProps = {
	balances?: any;
	transactions?: any;
	wallets?: any;
	networks?: any;
	portfolioPercentages?: any[];
};

const Section = styled.div`
	${tw`px-13 py-16 mt-5 bg-white`}
`;

export const Dashboard = ({ transactions, wallets, networks, portfolioPercentages, balances }: DashboardProps) => {
	const [showTransactions, setShowTransactions] = useState(true);
	const [showPortfolio, setShowPortfolio] = useState(true);
	const activeProfile = useActiveProfile();
	const history = useHistory();

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

	const emptyTransactionsText =
		"This will display the history of your transactions. But you don't have more than one transaction at the moment.";

	return (
		<div>
			{showPortfolio && balances && (
				<Section>
					<div className="-mb-2 text-4xl font-bold">Portfolio Chart</div>
					<LineChart height={260} period="22 Jun - 28 Jun" data={balances} lines={chartLines} />
					<div className="pt-6 mb-2 border-b border-dotted border-theme-neutral-200" />
					<PercentageBar title="Total portfolio" data={portfolioPercentages} />
				</Section>
			)}

			<Section>
				<Wallets
					onCreateWallet={() => history.push(`/profiles/${activeProfile?.id()}/wallets/create`)}
					onImportWallet={() => history.push(`/profiles/${activeProfile?.id()}/wallets/import`)}
					viewType="grid"
					title="Wallets"
					wallets={wallets}
					filterProperties={filterProperties}
				/>
			</Section>
			{showTransactions && (
				<Section data-testid="dashboard__transactions-view">
					<Transactions transactions={transactions} emptyText={emptyTransactionsText} />
				</Section>
			)}
		</div>
	);
};

Dashboard.defaultProps = {
	balances,
	portfolioPercentages,
	transactions,
	wallets,
};
