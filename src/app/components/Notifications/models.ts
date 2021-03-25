import { Contracts,DTO } from "@arkecosystem/platform-sdk-profiles";

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
	onAction?: (id: string) => void;
	onVisibilityChange?: (isVisible: boolean) => void;
	containmentRef?: any;
	meta?: Record<string, any>;
};

export type NotificationTransactionItemProps = {
	notification: NotificationItemProps;
	profile: Contracts.IProfile;
	containmentRef?: any;
	onVisibilityChange?: (isVisible: boolean) => void;
	onTransactionClick?: (item?: DTO.ExtendedTransactionData) => void;
};

export type NotificationsProps = {
	profile: Contracts.IProfile;
	onNotificationAction?: (id: string) => void;
	onTransactionClick?: (item?: DTO.ExtendedTransactionData) => void;
};
