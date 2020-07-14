import { Transaction } from "domains/transaction/components/TransactionTable";

export type EmptyPlaceholderProps = {
	title?: string;
};

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
	transactions?: Transaction[];
	transactionsHeader?: string;
	onAction?: any;
	emptyText?: string;
};
