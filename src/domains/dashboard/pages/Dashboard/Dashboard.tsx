import { Contracts } from "@arkecosystem/platform-sdk";
import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { LineChart } from "app/components/LineChart";
import { PercentageBar } from "app/components/PercentageBar";
import { useActiveProfile } from "app/hooks/env";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { setScreenshotProtection } from "utils/electron-utils";

import { balances, portfolioPercentages } from "../../data";

type DashboardProps = {
	balances?: any;
	wallets?: any;
	networks?: any;
	portfolioPercentages?: any[];
};

export const Dashboard = ({ networks, portfolioPercentages, balances }: DashboardProps) => {
	const [showTransactions, setShowTransactions] = useState(true);
	const [showPortfolio, setShowPortfolio] = useState(true);
	const [allTransactions, setAllTransactions] = useState<Contracts.TransactionDataType[] | undefined>(undefined);
	const activeProfile = useActiveProfile();
	const wallets = React.useMemo(() => activeProfile.wallets().values(), [activeProfile]);

	const history = useHistory();
	const { t } = useTranslation();

	useEffect(() => {
		const fetchProfileTransactions = async () => {
			const profileTransactions = await activeProfile?.transactionAggregate().transactions();
			const allTransactions: Contracts.TransactionDataType[] | undefined = profileTransactions?.items();

			return allTransactions && setAllTransactions(allTransactions);
		};

		setScreenshotProtection(activeProfile.settings().get(ProfileSetting.ScreenshotProtection) === true);
		fetchProfileTransactions();
	}, [activeProfile]);

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
		<Page profile={activeProfile}>
			{showPortfolio && balances && (
				<Section>
					<div className="-mb-2 text-4xl font-bold">{t("DASHBOARD.DASHBOARD_PAGE.CHART.TITLE")}</div>
					<LineChart height={260} period="22 Jun - 28 Jun" data={balances} lines={chartLines} />
					<div className="pt-6 mb-2 border-b border-dotted border-theme-neutral-200" />
					<PercentageBar
						title={t("DASHBOARD.DASHBOARD_PAGE.CHART.PERCENTAGES_LABEL")}
						data={portfolioPercentages}
					/>
				</Section>
			)}

			<Section className="flex-1">
				<Wallets
					onCreateWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/create`)}
					onImportWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/import`)}
					viewType="grid"
					title={t("COMMON.WALLETS")}
					wallets={wallets}
					filterProperties={filterProperties}
				/>
			</Section>

			{showTransactions && (
				<Section data-testid="dashboard__transactions-view">
					<Transactions transactions={allTransactions} />
				</Section>
			)}
		</Page>
	);
};

Dashboard.defaultProps = {
	balances,
	portfolioPercentages,
};
