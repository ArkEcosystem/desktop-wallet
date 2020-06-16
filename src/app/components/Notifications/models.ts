import { TransactionListItemProps } from "app/components/TransactionListItem/models";

export type Action = {
	label: string;
	value: string;
};

export type PluginNotification = {
	logoUrl?: string;
	logoClassName: string;
	title: string;
	description: string;
	action?: Action;
	onAction?: any;
};

export type NotificationsProps = {
	plugins?: PluginNotification[];
	pluginsHeader?: string;
	transactions?: TransactionListItemProps[];
	transactionsHeader?: string;
	onAction?: any;
};
