import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { LineChart } from "app/components/LineChart";
import { PercentageBar } from "app/components/PercentageBar";
import { useActiveProfile } from "app/hooks/env";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { balances, portfolioPercentages, transactions } from "../../data";

type DashboardProps = {
	balances?: any;
	transactions?: any;
	networks?: any;
	portfolioPercentages?: any[];
};

export const Dashboard = ({ transactions, networks, portfolioPercentages, balances }: DashboardProps) => {
	const [showTransactions, setShowTransactions] = useState(true);
	const [showPortfolio, setShowPortfolio] = useState(true);
	const [wallets, setWallets] = useState<Wallet[]>([]);
	// const [walletsTimer, setWalletsTimer] = useState<number|null>(null);
	const activeProfile = useActiveProfile();
	const history = useHistory();

	// TODO: remove use of timer
	useEffect(() => {
		const timer = setInterval(() => {
			setWallets(activeProfile?.wallets().values() || []);
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []); // @ts-ignore react-hooks/exhaustive-deps

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
		<Page>
			{showPortfolio && balances && (
				<Section>
					<div className="-mb-2 text-4xl font-bold">Portfolio Chart</div>
					<LineChart height={260} period="22 Jun - 28 Jun" data={balances} lines={chartLines} />
					<div className="pt-6 mb-2 border-b border-dotted border-theme-neutral-200" />
					<PercentageBar title="Total portfolio" data={portfolioPercentages} />
				</Section>
			)}

			<Section className="flex-1">
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
		</Page>
	);
};

Dashboard.defaultProps = {
	balances,
	portfolioPercentages,
	transactions,
};
