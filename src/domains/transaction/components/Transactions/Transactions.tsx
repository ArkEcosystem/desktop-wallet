import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { EmptyResults } from "app/components/EmptyResults";
import { Tab, TabList, Tabs } from "app/components/Tabs";
import { FilterTransactions } from "domains/transaction/components/FilterTransactions";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import { useProfileTransactions } from "domains/transaction/hooks/use-profile-transactions";
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
	title?: React.ReactNode;
};

export const Transactions = memo(
	({ emptyText, isCompact, profile, isVisible = true, wallets, isLoading = false, title }: TransactionsProps) => {
		const { t } = useTranslation();

		const [transactionModalItem, setTransactionModalItem] = useState<DTO.ExtendedTransactionData | undefined>(
			undefined,
		);

		const exchangeCurrency = useMemo(
			() => profile.settings().get<string>(Contracts.ProfileSetting.ExchangeCurrency),
			[profile],
		);

		const {
			updateFilters,
			isLoadingTransactions,
			isLoadingMore,
			transactions,
			activeMode,
			activeTransactionType,
			fetchMore,
			hasMore,
		} = useProfileTransactions({ profile, wallets });

		useEffect(() => {
			if (isLoading) {
				return;
			}

			updateFilters({
				activeMode: "all",
				activeTransactionType: undefined,
			});
		}, [isLoading, wallets.length, updateFilters]);

		if (!isVisible) {
			return <></>;
		}

		return (
			<>
				<div className="flex relative justify-between">
					{title && title}

					{!title && (
						<div className="mb-8 text-4xl font-bold">{t("DASHBOARD.TRANSACTION_HISTORY.TITLE")}</div>
					)}

					<FilterTransactions
						wallets={wallets}
						onSelect={(_, type) =>
							updateFilters({
								activeMode,
								activeTransactionType: type,
							})
						}
						className="mt-6"
					/>
				</div>
				<Tabs
					className="mb-8"
					activeId={activeMode}
					onChange={(activeTab) => {
						if (activeTab === activeMode) {
							return;
						}

						if (isLoading) {
							return;
						}

						updateFilters({
							activeMode: activeTab as string,
							activeTransactionType,
						});
					}}
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

				{transactions.length > 0 && hasMore && (
					<Button
						data-testid="transactions__fetch-more-button"
						variant="secondary"
						className="mt-10 mb-5 w-full"
						disabled={isLoadingMore}
						onClick={() => fetchMore()}
					>
						{isLoadingMore ? t("COMMON.LOADING") : t("COMMON.VIEW_MORE")}
					</Button>
				)}

				{transactions.length === 0 && !activeTransactionType && !isLoadingTransactions && (
					<EmptyBlock className="-mt-5">
						{emptyText || t("DASHBOARD.TRANSACTION_HISTORY.EMPTY_MESSAGE")}
					</EmptyBlock>
				)}

				{transactions.length === 0 && !!activeTransactionType && !isLoadingTransactions && (
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
			</>
		);
	},
);

Transactions.displayName = "Transactions";
