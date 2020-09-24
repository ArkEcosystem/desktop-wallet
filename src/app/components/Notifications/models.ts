import { ExtendedTransactionData, Profile } from "@arkecosystem/platform-sdk-profiles";
export type NotificationsSkeletonProps = {
	title?: string;
};

export type Action = {
	label: string;
	value: string;
};

export type NotificationItemProps = {
	id: string;
	body: string;
	name: string;
	action?: string;
	icon: string;
	image?: string;
	onAction?: (name: string) => void;
	onVisibilityChange?: (isVisible: boolean) => void;
	containmentRef?: any;
};

export type NotificationsProps = {
	profile: Profile;
	transactions?: ExtendedTransactionData[];
	onAction?: (name: string, item?: NotificationItemProps | ExtendedTransactionData) => void;
};
