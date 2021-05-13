import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { useConfiguration, useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useProfileUtils } from "app/hooks";
import { toasts } from "app/services";
import { Wallets } from "domains/dashboard/components/Wallets";
import { useWalletConfig } from "domains/dashboard/hooks";
import { Transactions } from "domains/transaction/components/Transactions";
import React, { useEffect, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const Dashboard = () => {
	const history = useHistory();
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();

	const { profileIsSyncing } = useConfiguration();
	const { env } = useEnvironmentContext();
	const { getErroredNetworks } = useProfileUtils(env);

	const { selectedWallets } = useWalletConfig({ profile: activeProfile });

	const profileWalletsCount = activeProfile.wallets().count();
	const showTransactions = useMemo(
		() => activeProfile.settings().get<boolean>(Contracts.ProfileSetting.DashboardTransactionHistory, true),
		[activeProfile],
	);

	useEffect(() => {
		if (profileIsSyncing) {
			return;
		}

		const { hasErroredNetworks, erroredNetworks } = getErroredNetworks(activeProfile);
		if (!hasErroredNetworks) {
			return;
		}

		toasts.warning(
			<Trans
				i18nKey="COMMON.ERRORS.NETWORK_ERROR"
				values={{ network: erroredNetworks.join(", ") }}
				components={{ bold: <strong /> }}
			/>,
		);
	}, [profileIsSyncing, activeProfile, t, getErroredNetworks]);

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

				<Section data-testid="dashboard__transactions-view">
					<Transactions
						profile={activeProfile}
						isVisible={showTransactions}
						wallets={selectedWallets}
						isLoading={profileIsSyncing}
					/>
				</Section>
			</Page>
		</>
	);
};
