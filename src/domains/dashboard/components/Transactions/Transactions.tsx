import { ExtendedTransactionData, Profile, ProfileSetting, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { EmptyResults } from "app/components/EmptyResults";
import { Section } from "app/components/Layout";
import { Tab, TabList, Tabs } from "app/components/Tabs";
import { FilterTransactions } from "domains/transaction/components/FilterTransactions";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type TransactionsProps = {
	fetchMoreAction?: Function;
	onRowClick?: (row: ExtendedTransactionData) => void;
	emptyText?: string;
	hideHeader?: boolean;
	isCompact?: boolean;
	profile: Profile;
	isVisible?: boolean;
	wallets: ReadWriteWallet[];
	isLoading?: boolean;
};

export const Transactions = memo(
	({ emptyText, isCompact, profile, isVisible = true, wallets, isLoading = false }: TransactionsProps) => {
		const { t } = useTranslation();

		const [selectedTransactionType, setSelectedTransactionType] = useState<any>();
		const [activeTransactionModeTab, setActiveTransactionModeTab] = useState("all");
		const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([]);
		const [transactionModalItem, setTransactionModalItem] = useState<ExtendedTransactionData | undefined>(
			undefined,
		);
		const [isLoadingTransactions, setIsLoading] = useState(isLoading);
		const exchangeCurrency = useMemo(() => profile.settings().get<string>(ProfileSetting.ExchangeCurrency), [
			profile,
		]);

		const abortRef = useRef<() => void>();

		const fetchTransactions = useCallback(
			async ({ flush, mode }: { flush: boolean; mode: string }) => {
				if (abortRef.current) {
					abortRef.current();
				}

				let aborted = false;
				abortRef.current = () => (aborted = true);

				const methodMap = {
					all: "transactions",
					sent: "sentTransactions",
					received: "receivedTransactions",
				};
				const method = methodMap[mode as keyof typeof methodMap];

				let currentTransactions = [...transactions];
				setIsLoading(true);

				if (flush) {
					profile.transactionAggregate().flush(method);
					currentTransactions = [];
					setTransactions([]);
				}

				const defaultQuery = { limit: 30, addresses: wallets.map((wallet) => wallet.address()) };
				const queryParams = selectedTransactionType
					? { ...defaultQuery, ...selectedTransactionType }
					: defaultQuery;

				// @ts-ignore
				const response = await profile.transactionAggregate()[method](queryParams);
				const transactionsAggregate = response.items();

				if (aborted) {
					return;
				}

				setIsLoading(false);
				setTransactions(currentTransactions.concat(transactionsAggregate));
			},
			[transactions, profile, selectedTransactionType, wallets],
		);

		useEffect(() => {
			if (isVisible && !isLoading) {
				fetchTransactions({ flush: true, mode: activeTransactionModeTab });
			}
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
						onClick={() => fetchTransactions({ flush: false, mode: activeTransactionModeTab })}
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
