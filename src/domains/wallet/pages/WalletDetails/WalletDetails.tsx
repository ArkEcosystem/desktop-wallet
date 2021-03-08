/* eslint-disable @typescript-eslint/require-await */
import { Coins } from "@arkecosystem/platform-sdk";
import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { ExtendedTransactionData, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { EmptyResults } from "app/components/EmptyResults";
import { Page, Section } from "app/components/Layout";
import { Tab, TabList, Tabs } from "app/components/Tabs";
import { useConfiguration } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { FilterTransactions } from "domains/transaction/components/FilterTransactions";
import { MultiSignatureDetail } from "domains/transaction/components/MultiSignatureDetail";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import { SignedTransactionTable } from "domains/transaction/components/TransactionTable/SignedTransactionTable/SignedTransactionTable";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { WalletHeader, WalletVote } from "./components";
import { useWalletTransactions } from "./hooks/use-wallet-transactions";

type WalletDetailsProps = {
	transactionLimit?: number;
};

export const WalletDetails = ({ transactionLimit }: WalletDetailsProps) => {
	const [isLoading, setIsLoading] = useState(true);

	const [signedTransactionModalItem, setSignedTransactionModalItem] = useState<SignedTransactionData | undefined>(
		undefined,
	);
	const [transactionModalItem, setTransactionModalItem] = useState<ExtendedTransactionData | undefined>(undefined);

	const { t } = useTranslation();

	const history = useHistory();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const [activeTransactionModeTab, setActiveTransactionModeTab] = useState("all");
	const [selectedTransactionType, setSelectedTransactionType] = useState<any>();

	const { profileIsSyncing } = useConfiguration();

	const {
		pendingMultiSignatureTransactions,
		transactions,
		fetchInit,
		fetchMore,
		isLoading: isLoadingTransactions,
		hasMore,
	} = useWalletTransactions(activeWallet, {
		limit: transactionLimit!,
		mode: activeTransactionModeTab,
		transactionType: selectedTransactionType,
	});

	const [showWalletVote, setShowWalletVote] = useState(false);

	useLayoutEffect(() => {
		setShowWalletVote(activeWallet.network().can(Coins.FeatureFlag.TransactionVote));
	}, [activeWallet]);

	const exchangeCurrency = activeProfile.settings().get<string>(ProfileSetting.ExchangeCurrency);

	useEffect(() => {
		const fetchAllData = async () => {
			await fetchInit();
			setIsLoading(false);
		};
		fetchAllData();
	}, [fetchInit]);

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
				<Section backgroundColor="--theme-color-secondary-900">
					<WalletHeader
						profile={activeProfile}
						wallet={activeWallet}
						onSend={() =>
							history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/send-transfer`)
						}
					/>
				</Section>

				{showWalletVote && (
					<Section backgroundColor="--theme-secondary-background-color" innerClassName="-my-2">
						<WalletVote
							wallet={activeWallet}
							onButtonClick={handleVoteButton}
							isLoadingDelegates={profileIsSyncing}
							isLoading={isLoading}
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

					<div>
						<>
							<div className="flex relative justify-between">
								<h2 className="mb-8 font-bold">
									{t("WALLETS.PAGE_WALLET_DETAILS.TRANSACTION_HISTORY.TITLE")}
								</h2>
								<FilterTransactions
									wallets={[activeWallet]}
									onSelect={(_, type) => setSelectedTransactionType(type)}
									className="mt-2"
								/>
							</div>
							<Tabs
								className="mb-6"
								activeId={activeTransactionModeTab}
								onChange={(id) => setActiveTransactionModeTab(id as string)}
							>
								<TabList className="w-full">
									<Tab tabId="all">{t("TRANSACTION.ALL_HISTORY")}</Tab>
									<Tab tabId="received">{t("TRANSACTION.INCOMING")}</Tab>
									<Tab tabId="sent">{t("TRANSACTION.OUTGOING")}</Tab>
								</TabList>
							</Tabs>

							<TransactionTable
								transactions={transactions}
								exchangeCurrency={exchangeCurrency}
								hideHeader={!isLoadingTransactions && transactions.length === 0}
								isLoading={isLoadingTransactions}
								onRowClick={(row) => setTransactionModalItem(row)}
							/>

							{transactions.length > 0 && hasMore && (
								<Button
									data-testid="transactions__fetch-more-button"
									variant="secondary"
									className="mt-10 mb-5 w-full"
									isLoading={isLoadingTransactions}
									onClick={() => fetchMore()}
								>
									{t("COMMON.VIEW_MORE")}
								</Button>
							)}

							{!isLoading && transactions.length === 0 && !selectedTransactionType && (
								<EmptyBlock className="-mt-2">
									{t("WALLETS.PAGE_WALLET_DETAILS.TRANSACTION_HISTORY.EMPTY_MESSAGE")}
								</EmptyBlock>
							)}

							{!isLoading && transactions.length === 0 && !!selectedTransactionType && (
								<EmptyResults
									className="flex-1"
									title={t("COMMON.EMPTY_RESULTS.TITLE")}
									subtitle={t("COMMON.EMPTY_RESULTS.SUBTITLE")}
								/>
							)}
						</>
					</div>
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

WalletDetails.defaultProps = {
	txSkeletonRowsLimit: 8,
	transactionLimit: 15,
};
