import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Image } from "app/components/Image";
import { Table } from "app/components/Table";
import { useEnvironmentContext } from "app/contexts";
import { useNotifications } from "app/hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
	markAsRead,
	NotificationItem,
	NotificationItemProperties,
	NotificationsProperties,
	NotificationsWrapper,
	NotificationTransactionItem,
} from ".";

export const Notifications = ({ profile, onNotificationAction, onTransactionClick }: NotificationsProperties) => {
	const { t } = useTranslation();
	const [allTransactions, setAllTransactions] = useState<DTO.ExtendedConfirmedTransactionData[]>([]);
	const environment = useEnvironmentContext();
	const {
		notifications: { sortTransactionNotificationsDesc, fetchRecentProfileTransactions },
	} = useNotifications();

	const byType = useCallback(
		(types: string[]) =>
			profile
				.notifications()
				.values()
				.filter((n) => types.includes(n.type)),
		[profile],
	);

	const wrapperReference = useRef();
	const notifications = byType(["plugin", "wallet"]);
	const transactions = sortTransactionNotificationsDesc(byType(["transaction"]));

	useEffect(() => {
		void (async () => {
			const allRecentTransactions = await fetchRecentProfileTransactions(profile, 12);

			setAllTransactions(allRecentTransactions);
		})();
	}, [fetchRecentProfileTransactions, profile]);

	if (transactions.length === 0 && notifications.length === 0) {
		return (
			<NotificationsWrapper>
				<EmptyBlock>
					<span className="whitespace-nowrap">{t("COMMON.NOTIFICATIONS.EMPTY")}</span>
				</EmptyBlock>
				<Image name="EmptyNotifications" className="mx-auto mt-8 mb-2 w-64" />
			</NotificationsWrapper>
		);
	}

	return (
		<NotificationsWrapper
			wider
			ref={wrapperReference as React.MutableRefObject<any>}
			data-testid="NotificationsWrapper"
		>
			{notifications.length > 0 && (
				<div className="space-y-2">
					<div className="text-base font-semibold text-theme-secondary-500">
						{t("COMMON.NOTIFICATIONS.PLUGINS_TITLE")}
					</div>
					<Table hideHeader columns={[{ Header: "-", className: "hidden" }]} data={notifications}>
						{(notification: NotificationItemProperties) => (
							<NotificationItem
								{...notification}
								onAction={onNotificationAction}
								onVisibilityChange={(isVisible) =>
									markAsRead(isVisible, notification.id, profile, environment)
								}
								containmentRef={wrapperReference}
							/>
						)}
					</Table>
				</div>
			)}

			{transactions.length > 0 && (
				<div className="space-y-2">
					<div className="text-base font-semibold text-theme-secondary-500">
						{t("COMMON.NOTIFICATIONS.TRANSACTIONS_TITLE")}
					</div>
					<Table hideHeader columns={[{ Header: "-", className: "hidden" }]} data={transactions}>
						{(notification: NotificationItemProperties) => (
							<NotificationTransactionItem
								transactionId={notification?.meta?.transactionId}
								allTransactions={allTransactions}
								profile={profile}
								containmentRef={wrapperReference}
								onVisibilityChange={(isVisible) =>
									markAsRead(isVisible, notification.id, profile, environment)
								}
								onTransactionClick={onTransactionClick}
							/>
						)}
					</Table>
				</div>
			)}
		</NotificationsWrapper>
	);
};
