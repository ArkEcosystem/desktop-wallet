import { Table } from "app/components/Table";
import { TransactionListItem, TransactionListItemProps } from "app/components/TransactionListItem";
import React from "react";

type Action = {
	label: string;
	value: string;
};

type PluginNotification = {
	logoUrl: string;
	logoClassName: string;
	title: string;
	description: string;
	action?: Action;
	onAction?: any;
};

type NotificationsProps = {
	plugins?: PluginNotification[];
	pluginsHeader?: string;
	transactions?: TransactionListItemProps[];
	transactionsHeader?: string;
	onAction?: any;
};

const Plugin = ({ logoUrl, logoClassName, title, description, action, onAction }: PluginNotification) => (
	<tr>
		<td className="w-16">
			<div className={logoClassName}>
				<img src={logoUrl} className="h-6 md:h-8 lg:h-10" alt={title} />
			</div>
		</td>
		<td>
			<span className="text-theme-neutral-700 font-bold text-sm">{title}</span>
			<span className="text-theme-neutral-600 text-sm"> {description}</span>
		</td>
		<td>
			{action && action.label && (
				<div
					data-testid="notifications__plugin-action"
					className="cursor-pointer text-theme-primary-600 text-sm text-right font-bold"
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
			<div className="text-sm text-theme-neutral-400 font-bold">{pluginsHeader}</div>
			<Table columns={hiddenTableHeaders} data={plugins}>
				{(plugin: PluginNotification) => (
					<Plugin {...plugin} onAction={(name: string) => onNotificationAction(name, plugin)} />
				)}
			</Table>
			<div className="mt-9 -mb-2 text-sm text-theme-neutral-400 font-bold">{transactionsHeader}</div>
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
