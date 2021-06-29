import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";

export interface Action {
	label: string;
	value: string;
}

export interface NotificationItemProperties {
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

export interface NotificationTransactionItemProperties {
	notification: NotificationItemProperties;
	profile: Contracts.IProfile;
	containmentRef?: any;
	onVisibilityChange?: (isVisible: boolean) => void;
	onTransactionClick?: (item?: DTO.ExtendedConfirmedTransactionData) => void;
}

export interface NotificationsProperties {
	profile: Contracts.IProfile;
	onNotificationAction?: (id: string) => void;
	onTransactionClick?: (item?: DTO.ExtendedConfirmedTransactionData) => void;
}
