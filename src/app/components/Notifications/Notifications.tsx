import { Table } from "app/components/Table";
import { TransactionListItem } from "app/components/TransactionListItem";
import { TransactionListItemProps } from "app/components/TransactionListItem/models";
import React from "react";

import { NotificationsProps, PluginNotification } from "./models";

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

export const Notifications = ({
	plugins,
	transactions,
	pluginsHeader,
	transactionsHeader,
	onAction,
}: NotificationsProps) => {
	const hiddenTableHeaders = [{ Header: "-", className: "hidden" }];

	const onNotificationAction = (name: string, item: any) => {
		if (typeof onAction === "function") onAction(name, item);
	};

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
	plugins: [],
};
