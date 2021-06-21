import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Tab, TabList, Tabs } from "app/components/Tabs";
import { FilterTransactions } from "domains/transaction/components/FilterTransactions";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import { useProfileTransactions } from "domains/transaction/hooks/use-profile-transactions";
import React, { memo, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

interface TransactionsProperties {
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
	onLoading?: (status: boolean) => void;
	isUpdatingWallet?: boolean;
	showUnconfirmed?: boolean;
}

export const Transactions = memo(
	({
		emptyText,
		isCompact,
		profile,
		isVisible = true,
		wallets,
		isLoading = false,
		title,
		isUpdatingWallet,
		onLoading,
		showUnconfirmed,
	}: TransactionsProperties) => {
		const { t } = useTranslation();

		const [transactionModalItem, setTransactionModalItem] = useState<DTO.ExtendedTransactionData | undefined>(
			undefined,
		);

		const [activeTransactionTypeLabel, setActiveTransactionTypeLabel] = useState("");

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
		} = useProfileTransactions({ profile, wallets, showUnconfirmed });

		useEffect(() => {
			if (isLoading) {
				return;
			}

			updateFilters({
				activeMode: "all",
				activeTransactionType: undefined,
			});
		}, [isLoading, wallets.length, updateFilters]);

		useEffect(() => {
			onLoading?.(isLoadingTransactions);
		}, [isLoadingTransactions, onLoading]);

		useEffect(() => {
			if (isUpdatingWallet) {
				updateFilters({ activeMode, activeTransactionType, timestamp: Date.now() });
			}
		}, [isUpdatingWallet]); // eslint-disable-line react-hooks/exhaustive-deps

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
					<TabList className="w-full h-15">
						<Tab tabId="all">{t("TRANSACTION.ALL")}</Tab>
						<Tab tabId="received">{t("TRANSACTION.INCOMING")}</Tab>
						<Tab tabId="sent">{t("TRANSACTION.OUTGOING")}</Tab>

						<div className="flex flex-1" />

						<FilterTransactions
							className="my-auto mr-6"
							wallets={wallets}
							onSelect={(option, type) => {
								setActiveTransactionTypeLabel(option.label);
								updateFilters({
									activeMode,
									activeTransactionType: type,
								});
							}}
							isDisabled={wallets.length === 0}
						/>
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
					<EmptyBlock className="-mt-5">
						<Trans
							i18nKey="DASHBOARD.TRANSACTION_HISTORY.NO_RESULTS"
							values={{
								type: activeTransactionTypeLabel,
							}}
							components={{ bold: <strong /> }}
						/>
					</EmptyBlock>
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
