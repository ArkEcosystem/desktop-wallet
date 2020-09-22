import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import React from "react";

import { EmptyPlaceholderProps, NotificationItemProps,NotificationsProps } from "./models";
import { mapNotificationAction } from "./utils";

const NotificationItem = ({ name, body, icon, image, action: actionName, onAction }: NotificationItemProps) => {
	const action = mapNotificationAction(actionName as string);

	return (
		<tr data-testid="NotificationItem">
			<td className="w-8">
				{icon && (
					<div className="w-full h-jull p-2 mr-4 rounded-lg">
						<Icon name={icon} width={32} height={32} />
					</div>
				)}

				{image && (
					<div className="w-full h-jull p-2 mr-4 rounded-lg">
						<img src={image} alt={name} />
					</div>
				)}
			</td>
			<td>
				<span className="font-bold text-md text-theme-neutral-600">{name}</span>
				<span className="text-md text-theme-neutral-600"> {body}</span>
			</td>
			<td>
				{action && action.label && (
					<div
						data-testid="NotificationItem__action"
						className="font-bold text-right cursor-pointer text-md text-theme-primary-500"
						onClick={() => onAction?.(action.value)}
					>
						{action.label}
					</div>
				)}
			</td>
		</tr>
	);
};

const EmptyPlaceholder = ({ title }: EmptyPlaceholderProps) => (
	<div>
		<div className="p-6 mb-5 border-2 border-theme-neutral-200 text-md rounded-xl text-theme-neutral-dark">
			{title}
		</div>
		<div>
			<Icon name="Placeholder" width={200} height={80} />
		</div>
		<div className="my-3 border-2 border-b border-theme-neutral-contrast" />
		<div>
			<Icon name="Placeholder" width={200} height={80} />
		</div>
	</div>
);

export const Notifications = ({
	plugins,
	transactions,
	pluginsHeader,
	transactionsHeader,
	onAction,
	emptyText,
	profile,
}: NotificationsProps) => {
	const hiddenTableHeaders = [{ Header: "-", className: "hidden" }];

	if (!profile?.id() || (!transactions!.length && !plugins!.length)) {
		return <EmptyPlaceholder title={emptyText} />;
	}

	const handleTransactionClick = (transaction: ExtendedTransactionData) => {
		onAction?.("click", transaction);
	};

	return (
		<div>
			{plugins!.length > 0 && (
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
