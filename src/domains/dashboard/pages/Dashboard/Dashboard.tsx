import { ExtendedTransactionData, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { sortByDesc } from "@arkecosystem/utils";
import { DropdownOption } from "app/components/Dropdown";
import { Page, Section } from "app/components/Layout";
import { LineChart } from "app/components/LineChart";
import { BarItem, PercentageBar } from "app/components/PercentageBar";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import { getNetworkExtendedData } from "domains/network/helpers";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { balances } from "../../data";

type DashboardProps = {
	balances?: any;
	networks?: any;
};

export const Dashboard = ({ networks, balances }: DashboardProps) => {
	const history = useHistory();
	const { env, persist } = useEnvironmentContext();
	const activeProfile = useActiveProfile();

	const [{ showPortfolio }, setShowPortfolio] = useState(
		activeProfile.settings().get(ProfileSetting.DashboardConfiguration) || { showPortfolio: true },
	);
	const [{ showTransactions }, setShowTransactions] = useState(
		activeProfile.settings().get(ProfileSetting.DashboardConfiguration) || { showTransactions: true },
	);
	const [transactionModalItem, setTransactionModalItem] = useState<ExtendedTransactionData | undefined>(undefined);
	const [allTransactions, setAllTransactions] = useState<ExtendedTransactionData[] | undefined>(undefined);
	const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

	const availableNetworks = useMemo(
		() =>
			env
				.availableNetworks()
				.filter((network) => network.isLive())
				.map((network) => {
					const extended = getNetworkExtendedData({ coin: network.coin(), network: network.id() });
					return Object.assign(network, { extra: extended });
				}),
		[env],
	);

	const wallets = useMemo(() => activeProfile.wallets().values(), [activeProfile]);
	const balancePerCoin = useMemo(() => activeProfile.walletAggregate().balancePerCoin(), [activeProfile]);

	const portfolioPercentages = useMemo(() => {
		const data: BarItem[] = [];

		for (const coin of Object.keys(balancePerCoin)) {
			for (const network of availableNetworks) {
				if (network.extra && network.ticker() === coin) {
					data.push({
						color: network.extra.textClass.replace("text-theme-", ""),
						label: coin,
						percentage: Number(balancePerCoin[coin].percentage),
					});
				}
			}
		}

		return sortByDesc([...data], "percentage");
	}, [availableNetworks, balancePerCoin]);

	const exchangeCurrency = activeProfile.settings().get<string>(ProfileSetting.ExchangeCurrency);

	const { t } = useTranslation();

	const fetchTransactions = async (flush = false) => {
		if (flush) {
			activeProfile.transactionAggregate().flush();
		}

		setIsLoadingTransactions(true);

		const response = await activeProfile.transactionAggregate().transactions({ limit: 10 });
		const transactions = response.items();

		setIsLoadingTransactions(false);

		return transactions && setAllTransactions((allTransactions || []).concat(transactions));
	};

	useEffect(() => {
		fetchTransactions(true);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const updateDashboardSettings = async () => {
			activeProfile.settings().set(ProfileSetting.DashboardConfiguration, { showPortfolio, showTransactions });
			await persist();
		};

		updateDashboardSettings();
	}, [activeProfile, persist, showPortfolio, showTransactions]);

	// Wallet controls data
	const filterProperties = {
		networks,
		visiblePortfolioView: showPortfolio,
		visibleTransactionsView: showTransactions,
		onWalletsDisplay: (option: DropdownOption) => {
			console.log("option", option);
		},
		togglePortfolioView: (showPortfolio: boolean) => {
			setShowPortfolio({ showPortfolio });
		},
		toggleTransactionsView: (showTransactions: boolean) => {
			setShowTransactions({ showTransactions });
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

						{!activeProfile.balance().isZero() && (
							<>
								<div className="pt-6 mb-2 border-b border-dashed border-theme-neutral-300 dark:border-theme-neutral-800" />

								<PercentageBar
									title={t("DASHBOARD.DASHBOARD_PAGE.CHART.PERCENTAGES_LABEL")}
									data={portfolioPercentages}
								/>
							</>
						)}
					</Section>
				)}

				<Section className={!showTransactions ? "flex-1" : undefined}>
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
					<Section className="flex-1" data-testid="dashboard__transactions-view">
						<Transactions
							title={t("DASHBOARD.TRANSACTION_HISTORY.TITLE")}
							transactions={allTransactions}
							exchangeCurrency={exchangeCurrency}
							fetchMoreAction={fetchTransactions}
							onRowClick={(row) => setTransactionModalItem(row)}
							isLoading={isLoadingTransactions}
						/>
					</Section>
				)}
			</Page>

			{transactionModalItem && (
				<TransactionDetailModal
					isOpen={!!transactionModalItem}
					transactionItem={transactionModalItem}
					onClose={() => setTransactionModalItem(undefined)}
				/>
			)}
		</>
	);
};

Dashboard.defaultProps = {
	balances,
};
