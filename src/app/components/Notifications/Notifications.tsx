import { Table } from "app/components/Table";
import { TransactionListItem } from "app/components/TransactionListItem";
import { TransactionListItemProps } from "app/components/TransactionListItem/models";
import React from "react";

import { Icon } from "../Icon";
import { EmptyPlaceholderProps,NotificationsProps, PluginNotification } from "./models";

const Plugin = ({ logoUrl, logoClassName, title, description, action, onAction }: PluginNotification) => (
	<tr>
		<td className="w-8">
			<div className={logoClassName}>{logoUrl && <img src={logoUrl} alt={title} />}</div>
		</td>
		<td>
			<span className="font-bold text-md text-theme-neutral-600">{title}</span>
			<span className="text-md text-theme-neutral-600"> {description}</span>
		</td>
		<td>
			{action && action.label && (
				<div
					data-testid="notifications__plugin-action"
					className="font-bold text-right cursor-pointer text-md text-theme-primary-500"
					onClick={() => onAction(action.value)}
				>
					{action.label}
				</div>
			)}
		</td>
	</tr>
);

const EmptyPlaceholder = ({ title }: EmptyPlaceholderProps) => (
	<div>
		<div className="border-2 border-theme-neutral-200 p-6 text-md rounded-xl text-theme-neutral-700 mb-5">
			{title}
		</div>
		<div>
			<Icon name="Placeholder" width={200} height={80} />
		</div>
		<div className="border-b border-2 border-theme-neutral-100 my-3" />
		<div>
			<Icon name="Placeholder" width={200} height={80} />
		</div>
	</div>
);

export const Notifications = ({
	plugins = [],
	transactions = [],
	pluginsHeader,
	transactionsHeader,
	onAction,
	emptyText,
}: NotificationsProps) => {
	const hiddenTableHeaders = [{ Header: "-", className: "hidden" }];

	const onNotificationAction = (name: string, item: any) => {
		if (typeof onAction === "function") onAction(name, item);
	};

	if (transactions.length === 0 && plugins.length == 0) {
		return <EmptyPlaceholder title={emptyText} />;
	}

	return (
		<div>
			<div className="text-sm font-bold text-theme-neutral-500">{pluginsHeader}</div>
			<Table columns={hiddenTableHeaders} data={plugins}>
				{(plugin: PluginNotification) => (
					<Plugin {...plugin} onAction={(name: string) => onNotificationAction(name, plugin)} />
				)}
			</Table>
			<div className="-mb-2 text-sm font-bold mt-9 text-theme-neutral-500">{transactionsHeader}</div>
			<Table columns={hiddenTableHeaders} data={transactions}>
				{(tx: TransactionListItemProps) => (
					<TransactionListItem onClick={() => onNotificationAction("click", tx)} variant="compact" {...tx} />
				)}
			</Table>
		</div>
	);
};

Notifications.defaultProps = {
	pluginsHeader: "",
	emptyText: "You have no notifications at this time.",
};
