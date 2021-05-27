import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";

export interface Action {
	label: string;
	value: string;
}

export interface NotificationItemProps {
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
}

export interface NotificationTransactionItemProps {
	notification: NotificationItemProps;
	profile: Contracts.IProfile;
	containmentRef?: any;
	onVisibilityChange?: (isVisible: boolean) => void;
	onTransactionClick?: (item?: DTO.ExtendedTransactionData) => void;
}

export interface NotificationsProps {
	profile: Contracts.IProfile;
	onNotificationAction?: (id: string) => void;
	onTransactionClick?: (item?: DTO.ExtendedTransactionData) => void;
}
