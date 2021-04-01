import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { EmptyResults } from "app/components/EmptyResults";
import { Section } from "app/components/Layout";
import { Tab, TabList, Tabs } from "app/components/Tabs";
import { useProfileTransactions } from "app/hooks/use-profile-transactions";
import { FilterTransactions } from "domains/transaction/components/FilterTransactions";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type TransactionsProps = {
	fetchMoreAction?: Function;
	onRowClick?: (row: DTO.ExtendedTransactionData) => void;
	emptyText?: string;
	hideHeader?: boolean;
	isCompact?: boolean;
	profile: Contracts.IProfile;
	isVisible?: boolean;
	wallets: Contracts.IReadWriteWallet[];
	isLoading?: boolean;
};

export const Transactions = memo(
	({ emptyText, isCompact, profile, isVisible = true, wallets, isLoading = false }: TransactionsProps) => {
		const { t } = useTranslation();

		const [selectedTransactionType, setSelectedTransactionType] = useState<any>();
		const [activeTransactionModeTab, setActiveTransactionModeTab] = useState("all");
		const [transactions, setTransactions] = useState<DTO.ExtendedTransactionData[]>([]);
		const [transactionModalItem, setTransactionModalItem] = useState<DTO.ExtendedTransactionData | undefined>(
			undefined,
		);
		const [isLoadingTransactions, setIsLoading] = useState(isLoading);
		const exchangeCurrency = useMemo(
			() => profile.settings().get<string>(Contracts.ProfileSetting.ExchangeCurrency),
			[profile],
		);

		const { fetchTransactions } = useProfileTransactions({ profile });

		useEffect(() => {
			const loadTransactions = async () => {
				if (isVisible && !isLoading) {
					setIsLoading(true);

					const fetchedTransactions = await fetchTransactions({
						wallets,
						flush: true,
						mode: activeTransactionModeTab,
						transactionType: selectedTransactionType,
					});

					setIsLoading(false);
					setTransactions(fetchedTransactions);
				}
			};

			loadTransactions();
			// eslint-disable-next-line
		}, [activeTransactionModeTab, selectedTransactionType, wallets.length, isLoading]);

		if (!isVisible) {
			return <></>;
		}

		return (
			<Section data-testid="dashboard__transactions-view">
				<div className="flex relative justify-between">
					<div className="mb-8 text-4xl font-bold">{t("DASHBOARD.TRANSACTION_HISTORY.TITLE")}</div>
					<FilterTransactions
						wallets={profile.wallets().values()}
						onSelect={(_, type) => {
							setSelectedTransactionType(type);
						}}
						className="mt-6"
					/>
				</div>
				<Tabs
					className="mb-8"
					activeId={activeTransactionModeTab}
					onChange={(id) => setActiveTransactionModeTab(id as string)}
				>
					<TabList className="w-full">
						<Tab tabId="all">{t("TRANSACTION.ALL")}</Tab>
						<Tab tabId="received">{t("TRANSACTION.INCOMING")}</Tab>
						<Tab tabId="sent">{t("TRANSACTION.OUTGOING")}</Tab>
					</TabList>
				</Tabs>

				<TransactionTable
					transactions={transactions}
					exchangeCurrency={exchangeCurrency}
					hideHeader={!isLoadingTransactions && transactions.length === 0}
					isLoading={isLoadingTransactions}
					skeletonRowsLimit={8}
					onRowClick={setTransactionModalItem}
					isCompact={isCompact}
				/>

				{transactions.length > 0 && (
					<Button
						data-testid="transactions__fetch-more-button"
						variant="secondary"
						className="mt-10 mb-5 w-full"
						disabled={isLoadingTransactions}
						onClick={async () => {
							const moreTransactions = await fetchTransactions({
								flush: false,
								mode: activeTransactionModeTab,
								transactionType: selectedTransactionType,
								wallets,
							});

							setTransactions(transactions.concat(moreTransactions));
						}}
					>
						{isLoadingTransactions ? t("COMMON.LOADING") : t("COMMON.VIEW_MORE")}
					</Button>
				)}

				{transactions.length === 0 && !selectedTransactionType && !isLoadingTransactions && (
					<EmptyBlock className="-mt-5">
						{emptyText || t("DASHBOARD.TRANSACTION_HISTORY.EMPTY_MESSAGE")}
					</EmptyBlock>
				)}

				{transactions.length === 0 && !!selectedTransactionType && !isLoadingTransactions && (
					<EmptyResults
						className="flex-1"
						title={t("COMMON.EMPTY_RESULTS.TITLE")}
						subtitle={t("COMMON.EMPTY_RESULTS.SUBTITLE")}
					/>
				)}

				{transactionModalItem && (
					<TransactionDetailModal
						isOpen={!!transactionModalItem}
						transactionItem={transactionModalItem}
						onClose={() => setTransactionModalItem(undefined)}
					/>
				)}
			</Section>
		);
	},
);

Transactions.displayName = "Transactions";
