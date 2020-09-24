import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import { useEnvironmentContext } from "app/contexts";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import React, { useMemo, useRef } from "react";

import { NotificationItem, NotificationsSkeleton } from "./";
import { NotificationItemProps, NotificationsProps } from "./models";
import { NotificationsWrapper } from "./styles";

export const Notifications = ({
	transactions,
	pluginsHeader,
	transactionsHeader,
	onAction,
	emptyText,
	profile,
}: NotificationsProps) => {
	const hiddenTableHeaders = [{ Header: "-", className: "hidden" }];
	const { persist } = useEnvironmentContext();

	// TODO: filter by type when multiple types will be used
	const plugins = useMemo(() => profile.notifications().values(), [profile, profile.notifications()]);
	const wrapperRef = useRef();

	if (!profile?.id() || (!transactions!.length && !plugins.length)) {
		return <NotificationsSkeleton title={emptyText} />;
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
						{pluginsHeader}
					</div>
					<Table hideHeader columns={hiddenTableHeaders} data={plugins}>
						{(plugin: NotificationItemProps) => (
							<NotificationItem
								{...plugin}
								onAction={(name: string) => onAction?.(name, plugin)}
								onVisibilityChange={(isVisible) => markAsRead(isVisible, plugin.id)}
								containmentRef={wrapperRef}
							/>
						)}
					</Table>
				</>
			)}

			{transactions!.length > 0 && (
				<>
					<div className="mb-2 text-sm font-bold text-theme-neutral sticky -top-5 bg-white z-10 -mx-4 py-4 pl-4 pr-8">
						{transactionsHeader}
					</div>
					<TransactionTable
						onRowClick={(tx: ExtendedTransactionData) => onAction?.("click", tx)}
						transactions={transactions!}
						isCompact
						hideHeader
					/>
				</>
			)}
		</NotificationsWrapper>
	);
};

Notifications.defaultProps = {
	pluginsHeader: "",
	emptyText: "You have no notifications at this time.",
	transactions: [],
};
