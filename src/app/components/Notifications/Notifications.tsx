import { Table } from "app/components/Table";
import { useEnvironmentContext } from "app/contexts";
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

	const byType = useCallback(
		(type: string) =>
			profile
				.notifications()
				.values()
				.filter((n) => n.type === type),
		[profile],
	);

	const wrapperRef = useRef();
	const plugins = byType("plugin");
	const transactions = byType("transaction");

	if (!transactions.length && !plugins.length) {
		return <NotificationsSkeleton title={t("COMMON.NOTIFICATIONS.EMPTY")} />;
	}

	return (
		<NotificationsWrapper ref={wrapperRef as React.MutableRefObject<any>} data-testid="NotificationsWrapper">
			{plugins.length > 0 && (
				<>
					<div className="sticky z-10 py-4 pl-4 pr-8 mb-2 -mx-4 text-sm font-bold text-theme-neutral -top-5">
						{t("COMMON.NOTIFICATIONS.PLUGINS_TITLE")}
					</div>
					<Table hideHeader columns={[{ Header: "-", className: "hidden" }]} data={plugins}>
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
				<div className="mt-4">
					<div className="sticky z-10 py-1 pl-4 pr-8 -mx-4 text-sm font-bold text-theme-neutral -top-5">
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
