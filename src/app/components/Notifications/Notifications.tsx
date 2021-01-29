import { Table } from "app/components/Table";
import { useEnvironmentContext } from "app/contexts";
import { useNotifications } from "app/hooks";
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import {
	markAsRead,
	NotificationItem,
	NotificationItemProps,
	NotificationsProps,
	NotificationsSkeleton,
	NotificationsWrapper,
	NotificationTransactionItem,
} from "./";

export const Notifications = ({ profile, onNotificationAction, onTransactionClick }: NotificationsProps) => {
	const { t } = useTranslation();
	const env = useEnvironmentContext();
	const {
		notifications: { sortTransactionNotificationsDesc },
	} = useNotifications();

	const byType = useCallback(
		(types: string[]) =>
			profile
				.notifications()
				.values()
				.filter((n) => types.includes(n.type)),
		[profile],
	);

	const wrapperRef = useRef();
	const notifications = byType(["plugin", "wallet"]);
	const transactions = sortTransactionNotificationsDesc(byType(["transaction"]));

	if (!transactions.length && !notifications.length) {
		return <NotificationsSkeleton title={t("COMMON.NOTIFICATIONS.EMPTY")} />;
	}

	return (
		<NotificationsWrapper ref={wrapperRef as React.MutableRefObject<any>} data-testid="NotificationsWrapper">
			{notifications.length > 0 && (
				<>
					<div className="-top-5 z-10 py-4 pr-8 pl-4 -mx-4 mb-2 text-sm font-bold text-theme-secondary-500">
						{t("COMMON.NOTIFICATIONS.PLUGINS_TITLE")}
					</div>
					<Table hideHeader columns={[{ Header: "-", className: "hidden" }]} data={notifications}>
						{(notification: NotificationItemProps) => (
							<NotificationItem
								{...notification}
								onAction={onNotificationAction}
								onVisibilityChange={(isVisible) => markAsRead(isVisible, notification.id, profile, env)}
								containmentRef={wrapperRef}
							/>
						)}
					</Table>
				</>
			)}

			{transactions.length > 0 && (
				<div className="mt-4">
					<div className="-top-5 z-10 py-1 pr-8 pl-4 -mx-4 text-sm font-bold text-theme-secondary-500">
						{t("COMMON.NOTIFICATIONS.TRANSACTIONS_TITLE")}
					</div>
					<Table hideHeader columns={[{ Header: "-", className: "hidden" }]} data={transactions}>
						{(notification: NotificationItemProps) => (
							<NotificationTransactionItem
								notification={notification}
								profile={profile}
								containmentRef={wrapperRef}
								onVisibilityChange={(isVisible) => markAsRead(isVisible, notification.id, profile, env)}
								onTransactionClick={onTransactionClick}
							/>
						)}
					</Table>
				</div>
			)}
		</NotificationsWrapper>
	);
};
