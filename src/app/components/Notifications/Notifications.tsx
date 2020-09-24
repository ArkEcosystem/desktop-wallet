import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import { useEnvironmentContext } from "app/contexts";
import { Transactions } from "domains/dashboard/components/Transactions";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

import { NotificationItem, NotificationsSkeleton } from "./";
import { NotificationItemProps, NotificationsProps } from "./models";
import { NotificationsWrapper } from "./styles";

export const Notifications = ({
	transactions,
	profile,
	onNotificationAction,
	isLoadingTransactions,
	onFetchMoreTransactions,
	onTransactionClick,
}: NotificationsProps) => {
	const hiddenTableHeaders = [{ Header: "-", className: "hidden" }];

	const { t } = useTranslation();
	const { persist } = useEnvironmentContext();

	// TODO: filter by type when multiple types will be used
	const plugins = profile.notifications().values();
	const wrapperRef = useRef();

	if (!profile?.id() || (!transactions!.length && !plugins.length)) {
		return <NotificationsSkeleton title={t("COMMON.NOTIFICATIONS.EMPTY")} />;
	}

	const markAsRead = async (isVisible: boolean, id: string) => {
		if (!isVisible) return;

		const notification = profile.notifications().get(id);
		if (!notification || notification?.read_at) return;

		profile.notifications().markAsRead(id);
		await persist();
	};

	return (
		<NotificationsWrapper ref={wrapperRef as React.MutableRefObject<any>}>
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
								onVisibilityChange={(isVisible) => markAsRead(isVisible, plugin.id)}
								containmentRef={wrapperRef}
							/>
						)}
					</Table>
				</>
			)}

			{transactions!.length > 0 && (
				<div className="mt-6">
					<div className="mb-2 text-sm font-bold text-theme-neutral sticky -top-5 bg-white z-10 -mx-4 py-4 pl-4 pr-8">
						{t("COMMON.NOTIFICATIONS.TRANSACTIONS_TITLE")}
					</div>
					<Transactions
						isLoading={isLoadingTransactions}
						hideHeader
						isCompact
						transactions={transactions}
						fetchMoreAction={onFetchMoreTransactions}
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
