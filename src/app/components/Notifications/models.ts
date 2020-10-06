import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
export type EmptyPlaceholderProps = {
	title?: string;
};

export type Action = {
	label: string;
	value: string;
	mountPath?: any;
	isProtected?: boolean;
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
	transactions?: ExtendedTransactionData[];
	transactionsHeader?: string;
	onAction?: any;
	emptyText?: string;
};
