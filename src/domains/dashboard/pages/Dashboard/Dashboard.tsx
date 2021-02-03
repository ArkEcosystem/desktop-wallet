import { Page } from "app/components/Layout";
import { useConfiguration } from "app/contexts";
import { useActiveProfile } from "app/hooks";
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

	const { showTransactions } = useDashboardConfig({ profile: activeProfile });
	const { profileIsSyncing } = useConfiguration();

	const profileWalletsCount = activeProfile.wallets().count();

	return (
		<>
			<Page profile={activeProfile}>
				<Wallets
					title={t("COMMON.WALLETS")}
					walletsCount={profileWalletsCount}
					isLoading={profileIsSyncing}
					onCreateWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/create`)}
					onImportWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/import`)}
					onImportLedgerWallet={() =>
						history.push(`/profiles/${activeProfile.id()}/wallets/import?ledger=true`)
					}
				/>

				<Transactions
					profile={activeProfile}
					isVisible={showTransactions}
					walletsCount={profileWalletsCount}
					isLoading={profileIsSyncing}
				/>
			</Page>
		</>
	);
};
