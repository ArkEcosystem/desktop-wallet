import { ExtendedTransactionData, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { LineChart } from "app/components/LineChart";
import { PercentageBar } from "app/components/PercentageBar";
import { useActiveProfile } from "app/hooks/env";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { setScreenshotProtection } from "utils/electron-utils";

import { balances, portfolioPercentages } from "../../data";

type DashboardProps = {
	balances?: any;
	networks?: any;
	portfolioPercentages?: any[];
};

export const Dashboard = ({ networks, portfolioPercentages, balances }: DashboardProps) => {
	const [showTransactions, setShowTransactions] = useState(true);
	const [showPortfolio, setShowPortfolio] = useState(true);
	const [transactionModalItem, setTransactionModalItem] = useState<ExtendedTransactionData | undefined>(undefined);
	const [allTransactions, setAllTransactions] = useState<ExtendedTransactionData[] | undefined>(undefined);
	const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
	const activeProfile = useActiveProfile();
	const wallets = React.useMemo(() => activeProfile.wallets().values(), [activeProfile]);
	const history = useHistory();
	const { t } = useTranslation();

	const fetchMoreTransactions = async () => {
		setIsLoadingTransactions(true);
		const response = await activeProfile.transactionAggregate().transactions({ limit: 10 });
		const transactions = response.items();

		setIsLoadingTransactions(false);
		return transactions && setAllTransactions(allTransactions?.concat(transactions));
	};

	useEffect(() => {
		const fetchProfileTransactions = async () => {
			const profileTransactions = await activeProfile.transactionAggregate().transactions({ limit: 10 });
			const allTransactions: ExtendedTransactionData[] | undefined = profileTransactions?.items();
			ipcRenderer.send("delegates-sync", wallets);

			setIsLoadingTransactions(false);
			return allTransactions && setAllTransactions(allTransactions);
		};

		setScreenshotProtection(activeProfile.settings().get(ProfileSetting.ScreenshotProtection) === true);
		fetchProfileTransactions();
	}, [activeProfile, wallets]);

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
		<>
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
						<Transactions
							transactions={allTransactions}
							fetchMoreAction={fetchMoreTransactions}
							onRowClick={(row) => setTransactionModalItem(row)}
							isLoading={isLoadingTransactions}
						/>
					</Section>
				)}
			</Page>
			{transactionModalItem && (
				<TransactionDetailModal
					isOpen={Boolean(transactionModalItem)}
					transactionItem={transactionModalItem}
					onClose={() => setTransactionModalItem(undefined)}
				/>
			)}
		</>
	);
};

Dashboard.defaultProps = {
	balances,
	portfolioPercentages,
};
