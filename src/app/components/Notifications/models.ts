import { ExtendedTransactionData,Profile } from "@arkecosystem/platform-sdk-profiles";
export type EmptyPlaceholderProps = {
	title?: string;
};

export type Action = {
	label: string;
	value: string;
};

export type NotificationItemProps = {
	body: string;
	name: string;
	action?: string;
	icon: string;
	image?: string;
	onAction?: (name: string) => void;
};

export type NotificationsProps = {
	plugins?: NotificationItemProps[];
	pluginsHeader?: string;
	transactions?: ExtendedTransactionData[];
	transactionsHeader?: string;
	onAction?: (name: string, item?: NotificationItemProps | ExtendedTransactionData) => void;
	emptyText?: string;
	profile?: Profile;
};
