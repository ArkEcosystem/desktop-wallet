import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Page } from "app/components/Layout";
import { useConfiguration } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { Wallets } from "domains/dashboard/components/Wallets";
import { useWalletConfig } from "domains/dashboard/hooks";
import { Transactions } from "domains/transaction/components/Transactions";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const Dashboard = () => {
	const history = useHistory();
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();

	const { profileIsSyncing } = useConfiguration();

	const { selectedWallets } = useWalletConfig({ profile: activeProfile });

	const profileWalletsCount = activeProfile.wallets().count();
	const showTransactions = useMemo(
		() => activeProfile.settings().get<boolean>(Contracts.ProfileSetting.DashboardTransactionHistory, true),
		[activeProfile],
	);

	return (
		<>
			<Page profile={activeProfile} isBackDisabled={true}>
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
					wallets={selectedWallets}
					isLoading={profileIsSyncing}
				/>
			</Page>
		</>
	);
};
