import { ExtendedTransactionData, Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { EmptyResults } from "app/components/EmptyResults";
import { Section } from "app/components/Layout";
import { Tab, TabList, Tabs } from "app/components/Tabs";
import { FilterTransactions } from "domains/transaction/components/FilterTransactions";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type TransactionsProps = {
	fetchMoreAction?: Function;
	onRowClick?: (row: ExtendedTransactionData) => void;
	emptyText?: string;
	hideHeader?: boolean;
	isCompact?: boolean;
	profile: Profile;
	isVisible?: boolean;
};

export const Transactions = memo(({ emptyText, isCompact, profile, isVisible = true }: TransactionsProps) => {
	const { t } = useTranslation();

	const [selectedTransactionType, setSelectedTransactionType] = useState<any>();
	const [activeTransactionModeTab, setActiveTransactionModeTab] = useState("all");
	const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([]);
	const [transactionModalItem, setTransactionModalItem] = useState<ExtendedTransactionData | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const exchangeCurrency = useMemo(() => profile.settings().get<string>(ProfileSetting.ExchangeCurrency), [profile]);

	const fetchTransactions = useCallback(
		async ({ flush, mode }: { flush: boolean; mode: string }) => {
			let currentTransactions = [...transactions];

			if (flush) {
				profile.transactionAggregate().flush();
				currentTransactions = [];
				setTransactions([]);
			}

			const methodMap = {
				all: "transactions",
				sent: "sentTransactions",
				received: "receivedTransactions",
			};
			const method = methodMap[mode as keyof typeof methodMap];

			setIsLoading(true);

			const limit = { limit: 30 };
			const queryParams = selectedTransactionType ? { ...limit, ...selectedTransactionType } : limit;
			// @ts-ignore
			const response = await profile.transactionAggregate()[method](queryParams);
			const transactionsAggregate = response.items();

			setIsLoading(false);

			setTransactions(currentTransactions.concat(transactionsAggregate));
		},
		[transactions, profile, selectedTransactionType, setIsLoading, setTransactions],
	);

	useEffect(() => {
		if (isVisible) fetchTransactions({ flush: true, mode: activeTransactionModeTab });
		// eslint-disable-next-line
	}, [activeTransactionModeTab, selectedTransactionType]);

	if (!isVisible) return <></>;

	return (
		<Section className="flex-1" data-testid="dashboard__transactions-view">
			<div className="relative flex justify-between">
				<div className="mb-8 text-4xl font-bold">{t("DASHBOARD.TRANSACTION_HISTORY.TITLE")}</div>
				<FilterTransactions onSelect={(_, type) => setSelectedTransactionType(type)} className="mt-6" />
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
				hideHeader={!isLoading && transactions.length === 0}
				isLoading={isLoading}
				skeletonRowsLimit={8}
				onRowClick={setTransactionModalItem}
				isCompact={isCompact}
			/>

			{transactions.length > 0 && (
				<Button
					data-testid="transactions__fetch-more-button"
					variant="plain"
					className="w-full mt-10 mb-5"
					disabled={isLoading}
					onClick={() => fetchTransactions({ flush: false, mode: activeTransactionModeTab })}
				>
					{isLoading ? t("COMMON.LOADING") : t("COMMON.VIEW_MORE")}
				</Button>
			)}

			{!isLoading && transactions.length === 0 && !selectedTransactionType && (
				<EmptyBlock className="-mt-5">
					{emptyText || t("DASHBOARD.TRANSACTION_HISTORY.EMPTY_MESSAGE")}
				</EmptyBlock>
			)}

			{!isLoading && transactions.length === 0 && !!selectedTransactionType && (
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
});

Transactions.displayName = "Transactions";
