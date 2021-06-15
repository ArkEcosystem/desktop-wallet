import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Action } from "app/components/Notifications/models";
import { NavbarVariant } from "types";

export interface MenuItem {
	title: string;
	mountPath: any;
}

export interface NavigationBarProps {
	title?: string;
	isBackDisabled?: boolean;
	profile?: Contracts.IProfile;
	variant?: NavbarVariant;
	menu: MenuItem[];
	userActions?: Action[];
	avatarImage?: string;
	onUserAction?: any;
	noBorder?: boolean;
	noShadow?: boolean;
}

export interface UserInfoProps {
	avatarImage?: string;
	onUserAction?: any;
	userActions?: Action[];
	userInitials?: string;
}
