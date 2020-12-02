import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { PortfolioChart } from "domains/dashboard/components/PortfolioChart";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import { useWalletFilters } from "domains/dashboard/components/Wallets/hooks";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { useDashboardConfig } from "./";

export const Dashboard = () => {
	const history = useHistory();
	const { env, persist } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const { t } = useTranslation();

	const { getConfiguration } = useDashboardConfig({
		profile: activeProfile,
	});

	const { showChartAnimation, showTransactions, viewType, walletsDisplayType } = getConfiguration();

	const [activeFilter, setActiveFilter] = useState(false);
	const { filterProperties } = useWalletFilters({ profile: activeProfile });

	// const previousConfiguration = usePrevious(dashboardConfiguration);
	// useEffect(() => {
	// 	console.log(" useEffect 2");
	// 	if (isEqual(previousConfiguration, dashboardConfiguration)) {
	// 		return;
	// 	}
	//
	// 	const updateDashboardSettings = async () => {
	// 		activeProfile.settings().set(ProfileSetting.DashboardConfiguration, dashboardConfiguration);
	// 		await persist();
	// 	};
	//
	// 	updateDashboardSettings();
	// }, [dashboardConfiguration, activeProfile, persist]);

	// useEffect(() => {
	// 	console.log('useEffect 3')
	// 	setActiveFilter(
	// 		defaultDashboardConfiguration.walletsDisplayType !== dashboardConfiguration.walletsDisplayType ||
	// 			!isEqual(
	// 				[...defaultDashboardConfiguration.selectedNetworkIds].sort(),
	// 				[...dashboardConfiguration.selectedNetworkIds].sort(),
	// 			),
	// 	);
	// }, [defaultDashboardConfiguration, dashboardConfiguration]);

	// useEffect(() => {
	// 	if (!showChartAnimation) return;
	//
	// 	setDashboardConfiguration({ showChartAnimation: false });
	// }, [showChartAnimation]);

	// Wallet controls data
	const handleSelectViewType = (viewType: string) => {
		// setDashboardConfiguration({ viewType });
	};

	const wallets = useMemo(() => {
		if (activeProfile.settings().get(ProfileSetting.UseTestNetworks)) return activeProfile.wallets().values();

		return activeProfile
			.wallets()
			.values()
			.filter((wallet) => wallet.network().isLive());
	}, [activeProfile]);

	return (
		<>
			<Page profile={activeProfile}>
				<Section>
					<PortfolioChart profile={activeProfile} env={env} />
				</Section>

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
						<Transactions profile={activeProfile} />
					</Section>
				)}
			</Page>
		</>
	);
};
