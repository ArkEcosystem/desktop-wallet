import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import { useEnvironmentContext } from "app/contexts";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import React, { useEffect, useMemo } from "react";

import { NotificationItem, NotificationsSkeleton } from "./";
import { NotificationItemProps, NotificationsProps } from "./models";

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

	const handleTransactionClick = (transaction: ExtendedTransactionData) => {
		onAction?.("click", transaction);
	};

	useEffect(() => {
		const addNotifications = async () => {
			console.log("adding notification");
			profile.notifications().push({
				icon: "ArkLogo",
				name: "ARK Explorer",
				body: "- update v2.5.6",
				action: "update",
			});
			await persist();
		};
		addNotifications();
	}, []);

	const plugins = useMemo(() => profile.notifications().values(), [profile]);
	console.log("plugins 1", plugins);

	if (!profile?.id() || (!transactions!.length && !plugins.length)) {
		return <NotificationsSkeleton title={emptyText} />;
	}

	return (
		<div>
			{plugins.length > 0 && (
				<>
					<div className="mb-2 text-sm font-bold text-theme-neutral">{pluginsHeader}</div>
					<Table hideHeader columns={hiddenTableHeaders} data={plugins}>
						{(plugin: NotificationItemProps) => (
							<NotificationItem {...plugin} onAction={(name: string) => onAction?.(name, plugin)} />
						)}
					</Table>
				</>
			)}

			{transactions!.length > 0 && (
				<>
					<div className="mb-2 text-sm font-bold mt-9 text-theme-neutral">{transactionsHeader}</div>
					<TransactionTable
						onRowClick={handleTransactionClick}
						transactions={transactions!}
						isCompact
						hideHeader
					/>
				</>
			)}
		</div>
	);
};

Notifications.defaultProps = {
	pluginsHeader: "",
	emptyText: "You have no notifications at this time.",
	transactions: [],
	// TODO: remove after integration
	plugins: [
		{
			icon: "ArkLogo",
			name: "ARK Explorer",
			body: "- update v2.5.6",
			action: "update",
		},
	],
};
