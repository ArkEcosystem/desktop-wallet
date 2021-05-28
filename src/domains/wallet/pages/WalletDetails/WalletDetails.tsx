/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk";
import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { useConfiguration, useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { toasts } from "app/services";
import cn from "classnames";
import { MultiSignatureDetail } from "domains/transaction/components/MultiSignatureDetail";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import { Transactions } from "domains/transaction/components/Transactions";
import { SignedTransactionTable } from "domains/transaction/components/TransactionTable/SignedTransactionTable/SignedTransactionTable";
import React, { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { WalletHeader, WalletVote } from "./components";
import { useWalletTransactions } from "./hooks/use-wallet-transactions";

export const WalletDetails = () => {
	const [signedTransactionModalItem, setSignedTransactionModalItem] = useState<Contracts.SignedTransactionData>();
	const [transactionModalItem, setTransactionModalItem] = useState<DTO.ExtendedTransactionData>();

	const [isUpdatingTransactions, setIsUpdatingTransactions] = useState(false);
	const [isUpdatingWallet, setIsUpdatingWallet] = useState(false);

	const history = useHistory();
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const { profileIsSyncing } = useConfiguration();

	const networkAllowsVoting = useMemo(() => activeWallet.network().allowsVoting(), [activeWallet]);
	const { syncMultiSignatures, pendingMultiSignatureTransactions } = useWalletTransactions(activeWallet);

	useEffect(() => {
		syncMultiSignatures();
	}, [syncMultiSignatures]);

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
					backgroundColor="--theme-color-secondary-900"
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
					<Section backgroundColor="--theme-secondary-background-color" innerClassName="-my-2">
						<WalletVote
							env={env}
							wallet={activeWallet}
							onButtonClick={handleVoteButton}
							profile={activeProfile}
						/>
					</Section>
				)}

				<Section className="flex-1">
					{pendingMultiSignatureTransactions.length > 0 && (
						<div className="mb-16">
							<h2 className="mb-6 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.PENDING_TRANSACTIONS")}</h2>
							<SignedTransactionTable
								transactions={pendingMultiSignatureTransactions}
								wallet={activeWallet}
								onClick={setSignedTransactionModalItem}
							/>
						</div>
					)}

					<Transactions
						title={
							<h2 className="mb-8 font-bold">
								{t("WALLETS.PAGE_WALLET_DETAILS.TRANSACTION_HISTORY.TITLE")}
							</h2>
						}
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
