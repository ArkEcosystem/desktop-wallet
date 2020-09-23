import { ExtendedTransactionData, Profile } from "@arkecosystem/platform-sdk-profiles";
export type NotificationsSkeletonProps = {
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
	pluginsHeader?: string;
	transactions?: ExtendedTransactionData[];
	transactionsHeader?: string;
	onAction?: (name: string, item?: NotificationItemProps | ExtendedTransactionData) => void;
	emptyText?: string;
	profile: Profile;
};
