import { ExtendedTransactionData, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { isEqual, sortByDesc, uniq, uniqBy } from "@arkecosystem/utils";
import { DropdownOption } from "app/components/Dropdown";
import { Page, Section } from "app/components/Layout";
import { LineChart } from "app/components/LineChart";
import { BarItem, PercentageBar } from "app/components/PercentageBar";
import { Tab, TabList, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, usePrevious } from "app/hooks";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import { getNetworkExtendedData } from "domains/network/helpers";
import { FilterTransactions } from "domains/transaction/components/FilterTransactions";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { balances } from "../../data";
import { DashboardConfiguration, DashboardProps } from "./";

export const Dashboard = ({ balances }: DashboardProps) => {
	const history = useHistory();
	const { env, persist } = useEnvironmentContext();
	const activeProfile = useActiveProfile();

	const defaultDashboardConfiguration = {
		showPortfolio: true,
		showTransactions: true,
		walletsDisplayType: "all",
		usePortfolioChartAnimation: true,
		selectedNetworkIds: uniq(
			activeProfile
				.wallets()
				.values()
				.map((wallet) => wallet.network().id()),
		),
	};

	const [dashboardConfiguration, setDashboardConfiguration] = useReducer(
		(state: DashboardConfiguration, newState: Record<string, any>) => ({ ...state, ...newState }),
		activeProfile.settings().get(ProfileSetting.DashboardConfiguration) || {
			...defaultDashboardConfiguration,
			viewType: "grid",
		},
	);

	const previousConfiguration = usePrevious(dashboardConfiguration);

	const {
		showPortfolio,
		showTransactions,
		viewType,
		walletsDisplayType,
		selectedNetworkIds,
		usePortfolioChartAnimation,
	} = dashboardConfiguration;

	const [activeFilter, setActiveFilter] = useState(false);
	const [activeTransactionModeTab, setActiveTransactionModeTab] = useState("all");
	const [selectedTransactionType, setSelectedTransactionType] = useState<any>();
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

	const fetchTransactions = async ({ flush, mode }: { flush: boolean; mode: string }) => {
		let currentTransactions = allTransactions || [];

		if (flush) {
			activeProfile.transactionAggregate().flush();
			currentTransactions = [];
			setAllTransactions([]);
		}

		const methodMap = {
			all: "transactions",
			sent: "sentTransactions",
			received: "receivedTransactions",
		};
		const method = methodMap[mode as keyof typeof methodMap];

		setIsLoadingTransactions(true);

		const limit = { limit: 30 };
		const queryParams = selectedTransactionType ? { ...limit, ...selectedTransactionType } : limit;
		// @ts-ignore
		const response = await activeProfile.transactionAggregate()[method](queryParams);
		const transactions = response.items();

		setIsLoadingTransactions(false);

		return transactions && setAllTransactions(currentTransactions.concat(transactions));
	};

	useEffect(() => {
		fetchTransactions({ flush: true, mode: activeTransactionModeTab });
		// eslint-disable-next-line
	}, [activeTransactionModeTab, selectedTransactionType]);

	useEffect(() => {
		if (isEqual(previousConfiguration, dashboardConfiguration)) {
			return;
		}

		const updateDashboardSettings = async () => {
			activeProfile.settings().set(ProfileSetting.DashboardConfiguration, dashboardConfiguration);
			await persist();
		};

		updateDashboardSettings();
	});

	useEffect(() => {
		setActiveFilter(
			defaultDashboardConfiguration.walletsDisplayType !== dashboardConfiguration.walletsDisplayType ||
				!isEqual(
					[...defaultDashboardConfiguration.selectedNetworkIds].sort(),
					[...dashboardConfiguration.selectedNetworkIds].sort(),
				),
		);
	}, [defaultDashboardConfiguration, dashboardConfiguration]);

	useEffect(
		() => () => {
			if (!usePortfolioChartAnimation) return;

			activeProfile.settings().set(ProfileSetting.DashboardConfiguration, {
				...dashboardConfiguration,
				usePortfolioChartAnimation: false,
			});
		},
		[activeProfile, usePortfolioChartAnimation, dashboardConfiguration],
	);

	// Wallet controls data
	const handleSelectViewType = (viewType: string) => {
		setDashboardConfiguration({ viewType });
	};

	const networks = useMemo(() => {
		const networks = activeProfile
			.wallets()
			.values()
			.map((wallet) => ({
				id: wallet.network().id(),
				isLive: wallet.network().isLive(),
				name: wallet.network().name(),
				coin: wallet.network().coin(),
				isSelected: selectedNetworkIds.includes(wallet.network().id()),
			}));

		return uniqBy(networks, (n) => n.id);
	}, [activeProfile, selectedNetworkIds]);

	const filterProperties = {
		networks,
		useTestNetworks: activeProfile.settings().get(ProfileSetting.UseTestNetworks),
		walletsDisplayType,
		selectedNetworkIds,
		visiblePortfolioView: showPortfolio,
		visibleTransactionsView: showTransactions,
		togglePortfolioView: (showPortfolio: boolean) => {
			setDashboardConfiguration({ showPortfolio });
		},
		toggleTransactionsView: (showTransactions: boolean) => {
			setDashboardConfiguration({ showTransactions });
		},
		onWalletsDisplayType: ({ value }: DropdownOption) => {
			setDashboardConfiguration({ walletsDisplayType: value });
		},
		onNetworkChange: (_: any, networks: any[]) => {
			setDashboardConfiguration({
				selectedNetworkIds: networks.filter((n) => n.isSelected).map((n) => n.id),
			});
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
						<LineChart
							useAnimation={usePortfolioChartAnimation}
							height={260}
							period="22 Jun - 28 Jun"
							data={balances}
							lines={chartLines}
						/>

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
						title={t("COMMON.WALLETS")}
						activeFilter={activeFilter}
						filterProperties={filterProperties}
						viewType={viewType}
						wallets={wallets}
						onCreateWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/create`)}
						onImportWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/import`)}
						onImportLedgerWallet={() =>
							history.push(`/profiles/${activeProfile.id()}/wallets/import?ledger=true`)
						}
						onSelectViewType={handleSelectViewType}
					/>
				</Section>

				{showTransactions && (
					<Section className="flex-1" data-testid="dashboard__transactions-view">
						<div className="relative flex justify-between">
							<div className="mb-8 text-4xl font-bold">{t("DASHBOARD.TRANSACTION_HISTORY.TITLE")}</div>
							<FilterTransactions
								onSelect={(_, type) => setSelectedTransactionType(type)}
								className="mt-6"
							/>
						</div>
						<Tabs
							className="mb-8"
							activeId={activeTransactionModeTab}
							onChange={(id) => setActiveTransactionModeTab(id as string)}
						>
							<TabList className="w-full">
								<Tab tabId="all">{t("TRANSACTION.ALL_HISTORY")}</Tab>
								<Tab tabId="received">{t("TRANSACTION.INCOMING")}</Tab>
								<Tab tabId="sent">{t("TRANSACTION.OUTGOING")}</Tab>
							</TabList>
						</Tabs>
						<Transactions
							isUsingFilters={!!selectedTransactionType}
							transactions={allTransactions}
							exchangeCurrency={exchangeCurrency}
							fetchMoreAction={() => fetchTransactions({ flush: false, mode: activeTransactionModeTab })}
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
