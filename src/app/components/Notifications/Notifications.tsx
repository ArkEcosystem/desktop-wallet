import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import { useEnvironmentContext } from "app/contexts";
import { Transactions } from "domains/dashboard/components/Transactions";
import React, { useEffect,useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
	markAsRead,
	NotificationItem,
	NotificationItemProps,
	NotificationsProps,
	NotificationsSkeleton,
	NotificationsWrapper,
} from "./";

export const Notifications = ({ profile, onNotificationAction, onTransactionClick }: NotificationsProps) => {
	const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
	const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([]);

	const { t } = useTranslation();
	const env = useEnvironmentContext();

	const hiddenTableHeaders = [{ Header: "-", className: "hidden" }];

	// TODO: filter by type when multiple types will be used
	const plugins = profile.notifications().values();
	const wrapperRef = useRef();

	const fetchTransactions = async () => {
		setIsLoadingTransactions(true);
		const txs = await profile.transactionAggregate().transactions({ limit: 5 });
		setTransactions([...transactions, ...txs.items()]);
		setIsLoadingTransactions(false);
	};

	useEffect(() => {
		fetchTransactions();
	}, [profile]);

	if (!transactions.length && !plugins.length) {
		return <NotificationsSkeleton title={t("COMMON.NOTIFICATIONS.EMPTY")} />;
	}

	return (
		<NotificationsWrapper ref={wrapperRef as React.MutableRefObject<any>} data-testid="NotificationsWrapper">
			{plugins.length > 0 && (
				<>
					<div className="mb-2 text-sm font-bold text-theme-neutral sticky -top-5 bg-white z-10 -mx-4 py-4 pl-4 pr-8">
						{t("COMMON.NOTIFICATIONS.PLUGINS_TITLE")}
					</div>
					<Table hideHeader columns={hiddenTableHeaders} data={plugins}>
						{(plugin: NotificationItemProps) => (
							<NotificationItem
								{...plugin}
								onAction={onNotificationAction}
								onVisibilityChange={(isVisible) => markAsRead(isVisible, plugin.id, profile, env)}
								containmentRef={wrapperRef}
							/>
						)}
					</Table>
				</>
			)}

			{transactions.length > 0 && (
				<div className="mt-6">
					<div className="mb-2 text-sm font-bold text-theme-neutral sticky -top-5 bg-white z-10 -mx-4 py-4 pl-4 pr-8">
						{t("COMMON.NOTIFICATIONS.TRANSACTIONS_TITLE")}
					</div>
					<Transactions
						isLoading={isLoadingTransactions}
						hideHeader
						isCompact
						transactions={transactions}
						fetchMoreAction={fetchTransactions}
						onRowClick={(tx: ExtendedTransactionData) => onTransactionClick?.(tx)}
					/>
				</div>
			)}
		</NotificationsWrapper>
	);
};

Notifications.defaultProps = {
	transactions: [],
};
