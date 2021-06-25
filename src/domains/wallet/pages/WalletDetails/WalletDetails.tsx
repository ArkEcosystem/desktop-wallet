/* eslint-disable @typescript-eslint/require-await */
import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { useConfiguration, useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { toasts } from "app/services";
import cn from "classnames";
import { MultiSignatureDetail } from "domains/transaction/components/MultiSignatureDetail";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import { Transactions } from "domains/transaction/components/Transactions";
import { PendingTransactions } from "domains/transaction/components/TransactionTable/PendingTransactionsTable";
import React, { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { WalletHeader, WalletVote } from "./components";
import { useWalletTransactions } from "./hooks/use-wallet-transactions";

export const WalletDetails = () => {
	const [signedTransactionModalItem, setSignedTransactionModalItem] = useState<DTO.ExtendedSignedTransactionData>();
	const [transactionModalItem, setTransactionModalItem] = useState<DTO.ExtendedConfirmedTransactionData>();

	const [isUpdatingTransactions, setIsUpdatingTransactions] = useState(false);
	const [isUpdatingWallet, setIsUpdatingWallet] = useState(false);

	const history = useHistory();
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const { profileIsSyncing } = useConfiguration();

	const networkAllowsVoting = useMemo(() => activeWallet.network().allowsVoting(), [activeWallet]);
	const { pendingSigned, pendingTransfers, syncPending } = useWalletTransactions(activeWallet);

	useEffect(() => {
		syncPending();
	}, [syncPending]);

	useEffect(() => {
		if (activeWallet.hasBeenPartiallyRestored()) {
			toasts.warning(
				<Trans
					i18nKey="COMMON.ERRORS.NETWORK_ERROR"
					values={{ network: `${activeWallet.network().coin()} ${activeWallet.network().name()}` }}
					components={{ bold: <strong /> }}
				/>,
			);
		}
	}, [activeWallet, t]);

	const handleVoteButton = (filter?: string) => {
		/* istanbul ignore else */
		if (filter) {
			return history.push({
				pathname: `/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/votes`,
				search: `?filter=${filter}`,
			});
		}

		history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/votes`);
	};

	/* istanbul ignore next */
	return (
		<>
			<Page profile={activeProfile}>
				<Section
					className={cn({
						"border-b border-transparent dark:border-theme-secondary-800": !networkAllowsVoting,
					})}
					backgroundClassName="bg-theme-secondary-900"
				>
					<WalletHeader
						profile={activeProfile}
						wallet={activeWallet}
						onSend={() =>
							history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/send-transfer`)
						}
						onUpdate={setIsUpdatingWallet}
						isUpdatingTransactions={isUpdatingTransactions}
					/>
				</Section>

				{networkAllowsVoting && (
					<Section
						borderClassName="border-theme-secondary-300 dark:border-transparent"
						backgroundClassName="bg-theme-background dark:bg-theme-secondary-background"
						innerClassName="-my-2"
						border
					>
						<WalletVote
							env={env}
							wallet={activeWallet}
							onButtonClick={handleVoteButton}
							profile={activeProfile}
						/>
					</Section>
				)}

				<Section className="flex-1">
					{[...pendingSigned, ...pendingTransfers].length > 0 && (
						<div className="mb-8">
							<PendingTransactions
								transfers={pendingTransfers}
								signed={pendingSigned}
								wallet={activeWallet}
								onPendingTransactionClick={setTransactionModalItem}
								onClick={setSignedTransactionModalItem}
							/>
						</div>
					)}

					<Transactions
						title={<h2 className="mb-6">{t("WALLETS.PAGE_WALLET_DETAILS.TRANSACTION_HISTORY.TITLE")}</h2>}
						showUnconfirmed={false}
						profile={activeProfile}
						wallets={[activeWallet]}
						isLoading={profileIsSyncing}
						isUpdatingWallet={isUpdatingWallet}
						onLoading={setIsUpdatingTransactions}
					/>
				</Section>
			</Page>

			{signedTransactionModalItem && (
				<MultiSignatureDetail
					wallet={activeWallet}
					isOpen={!!signedTransactionModalItem}
					transaction={signedTransactionModalItem}
					onClose={() => setSignedTransactionModalItem(undefined)}
				/>
			)}

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
