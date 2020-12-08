import { Page } from "app/components/Layout";
import { useActiveProfile } from "app/hooks";
import { PortfolioChart } from "domains/dashboard/components/PortfolioChart";
import { Transactions } from "domains/dashboard/components/Transactions";
import { Wallets } from "domains/dashboard/components/Wallets";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { useDashboardConfig } from "./hooks";

export const Dashboard = () => {
	const history = useHistory();
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();

	const { showTransactions, showPortfolio } = useDashboardConfig({ profile: activeProfile });

	return (
		<>
			<Page profile={activeProfile}>
				<PortfolioChart profile={activeProfile} isVisible={showPortfolio} />

				<Wallets
					title={t("COMMON.WALLETS")}
					onCreateWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/create`)}
					onImportWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/import`)}
					onImportLedgerWallet={() =>
						history.push(`/profiles/${activeProfile.id()}/wallets/import?ledger=true`)
					}
				/>

				<Transactions profile={activeProfile} isVisible={showTransactions} />
			</Page>
		</>
	);
};
