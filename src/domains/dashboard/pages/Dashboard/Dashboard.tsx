import { LineChart } from "app/components/LineChart";
import { PercentageBar } from "app/components/PercentageBar";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import React, { useState } from "react";
import tw, { styled } from "twin.macro";
import { useTranslation } from "react-i18next";

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

	const { t } = useTranslation();

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
		<div>
			{showPortfolio && balances && (
				<Section>
					<div className="-mb-2 text-4xl font-bold">{t("DASHBOARD.DASHBOARD_PAGE.CHART.TITLE")}</div>
					<LineChart height={260} period="22 Jun - 28 Jun" data={balances} lines={chartLines} />
					<div className="pt-6 mb-2 border-b border-dotted border-theme-neutral-200" />
					<PercentageBar title={t("DASHBOARD.DASHBOARD_PAGE.CHART.PERCENTAGES_LABEL")} data={portfolioPercentages} />
				</Section>
			)}

			<Section>
				<Wallets viewType="grid" wallets={wallets} filterProperties={filterProperties} />
			</Section>
			{showTransactions && (
				<Section data-testid="dashboard__transactions-view">
					<Transactions transactions={transactions} />
				</Section>
			)}
		</div>
	);
};
