import { images } from "app/assets/images";
import { Badge } from "app/components/Badge";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Notifications } from "app/components/Notifications";
import { Action, NotificationsProps } from "app/components/Notifications/models";
import { useActiveProfile } from "app/hooks/env";
import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { defaultStyle } from "./NavigationBar.styles";

const commonAssets = images.common;

type MenuItem = {
	title: string;
	mountPath: any;
};

type NavigationBarProps = {
	menu?: MenuItem[];
	userActions?: Action[];
	userInitials?: string;
	currencyIcon: string;
	balance?: string;
	notifications?: any;
	onUserAction?: any;
	onNotificationAction?: any;
};

const NavWrapper = styled.nav`
	${defaultStyle}
	${tw`sticky inset-x-0 top-0 bg-white shadow-md`}
`;

const NotificationsDropdown = ({
	pluginsHeader,
	plugins,
	transactionsHeader,
	transactions,
	onAction,
}: NotificationsProps) => (
	<Dropdown
		toggleContent={
			<div className="flex items-center h-full px-6 cursor-pointer text-theme-primary-300">
				<Icon name="Notification" width={22} height={22} />
			</div>
		}
	>
		<div className="p-8 py-3 mt-2 w-128">
			<Notifications
				pluginsHeader={pluginsHeader}
				plugins={plugins}
				transactionsHeader={transactionsHeader}
				transactions={transactions}
				onAction={onAction}
			/>
		</div>
	</Dropdown>
);

const UserInfo = ({ onUserAction, currencyIcon, userActions, userInitials }: NavigationBarProps) => {
	return (
		<Dropdown
			onSelect={onUserAction}
			options={userActions}
			toggleContent={(isOpen: boolean) => (
				<div className="cursor-pointer" data-testid="navbar__useractions">
					<Circle className="-mr-1 border-theme-neutral-300" size="lg">
						<span className="text-theme-neutral-600">
							<Icon name={currencyIcon} />
						</span>
					</Circle>
					<Circle className="relative bg-theme-primary border-theme-primary rotate-90" size="lg">
						<span className="text-sm text-theme-background">{userInitials}</span>
						<Badge
							className={`transform ${
								isOpen ? "rotate-180" : ""
							} bg-theme-primary-contrast border-theme-primary-contrast text-theme-primary-500`}
							position="right"
							icon="ChevronDown"
							iconWidth={10}
							iconHeight={10}
						/>
					</Circle>
				</div>
			)}
		/>
	);
};

export const NavigationBar = ({
	menu,
	userActions,
	userInitials,
	balance,
	currencyIcon,
	notifications,
	onNotificationAction,
}: NavigationBarProps) => {
	const history = useHistory();
	const activeProfile = useActiveProfile();

	const renderMenu = () => {
		if (!activeProfile?.id()) {
			return null;
		}

		return (
			menu &&
			menu.map((menuItem: any, index: number) => (
				<li key={index} className="flex">
					<NavLink
						to={menuItem.mountPath(activeProfile.id())}
						title={menuItem.title}
						className="flex items-center mx-4 font-bold text-md text-theme-neutral"
					>
						{menuItem.title}
					</NavLink>
				</li>
			))
		);
	};
	return (
		<NavWrapper aria-labelledby="main menu">
			<div className="px-4 sm:px-6 lg:px-">
				<div className="relative flex justify-between h-20 md:h-24">
					<div className="flex items-center flex-shrink-0">
						<div className="flex p-2 mr-4 rounded-lg bg-logo">
							<img src={commonAssets.ARKLogo} className="h-6 md:h-8 lg:h-10" alt="ARK Logo" />
						</div>
						<ul className="flex h-20 md:h-24">{renderMenu()}</ul>
					</div>

					<div className="flex items-center">
						<NotificationsDropdown {...notifications} onAction={onNotificationAction} />

						<div className="h-8 border-r border-theme-neutral-200" />

						<div className="flex items-center h-full px-6 cursor-pointer text-theme-primary-300">
							<Icon name="Sent" width={22} height={22} />
						</div>

						<div className="h-8 border-r border-theme-neutral-200" />

						<div className="flex items-center h-full px-6 cursor-pointer text-theme-primary-300">
							<Icon name="Receive" width={22} height={22} />
						</div>

						<div className="h-8 border-r border-theme-neutral-200" />

						<div className="p-2 ml-4 text-right">
							<div className="text-xs text-theme-neutral">Your balance</div>
							<div className="text-sm font-bold text-theme-neutral-dark">{balance}</div>
						</div>

						<div className="flex p-1 cusror-pointer">
							<UserInfo
								userInitials={userInitials}
								currencyIcon={currencyIcon}
								userActions={userActions}
								onUserAction={(action: any) => history.push(action.mountPath(activeProfile?.id()))}
							/>
						</div>
					</div>
				</div>
			</div>
		</NavWrapper>
	);
};

NavigationBar.defaultProps = {
	currencyIcon: "Bitcoin",
	notifications: {
		transactionsHeader: "Transactions",
		transactions: [],
		pluginsHeader: "Plugins",
		plugins: [],
	},
	menu: [
		{
			title: "Portfolio",
			mountPath: (profileId: string) => `/profiles/${profileId}/dashboard`,
		},
		{
			title: "Plugins",
			mountPath: (profileId: string) => `/profiles/${profileId}/plugins`,
		},
		{
			title: "Exchange",
			mountPath: (profileId: string) => `/profiles/${profileId}/exchange`,
		},
		{
			title: "News",
			mountPath: (profileId: string) => `/profiles/${profileId}/news`,
		},
	],
	userActions: [
		{
			label: "Contacts",
			value: "contacts",
			mountPath: (profileId: string) => `/profiles/${profileId}/contacts`,
		},
		{
			label: "Settings",
			value: "settings",
			mountPath: (profileId: string) => `/profiles/${profileId}/settings`,
		},
		{
			label: "Support",
			value: "support",
			mountPath: (profileId: string) => `/profiles/${profileId}/support`,
		},
		{
			label: "Exit",
			value: "exit",
			mountPath: () => `/`,
		},
	],
};
