import { EmptyBlock } from "app/components/EmptyBlock";
import { Image } from "app/components/Image";
import { Table } from "app/components/Table";
import { useEnvironmentContext } from "app/contexts";
import { useNotifications } from "app/hooks";
import React, { useCallback, useRef } from "react";
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
	const environment = useEnvironmentContext();
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

	const wrapperReference = useRef();
	const notifications = byType(["plugin", "wallet"]);
	const transactions = sortTransactionNotificationsDesc(byType(["transaction"]));

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
		<NotificationsWrapper ref={wrapperReference as React.MutableRefObject<any>} data-testid="NotificationsWrapper">
			{notifications.length > 0 && (
				<>
					<div className="-top-5 z-10 py-4 pr-8 pl-4 -mx-4 mb-2 text-sm font-bold text-theme-secondary-500">
						{t("COMMON.NOTIFICATIONS.PLUGINS_TITLE")}
					</div>
					<Table hideHeader columns={[{ Header: "-", className: "hidden" }]} data={notifications}>
						{(notification: NotificationItemProperties) => (
							<NotificationItem
								{...notification}
								onAction={onNotificationAction}
								onVisibilityChange={(isVisible) => markAsRead(isVisible, notification.id, profile, environment)}
								containmentRef={wrapperReference}
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
						{(notification: NotificationItemProperties) => (
							<NotificationTransactionItem
								notification={notification}
								profile={profile}
								containmentRef={wrapperReference}
								onVisibilityChange={(isVisible) => markAsRead(isVisible, notification.id, profile, environment)}
								onTransactionClick={onTransactionClick}
							/>
						)}
					</Table>
				</div>
			)}
		</NotificationsWrapper>
	);
};
