import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Badge } from "app/components/Badge";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Notifications } from "app/components/Notifications";
import { Action, NotificationsProps } from "app/components/Notifications/models";
import { ReceiveFunds } from "domains/wallet/components/ReceiveFunds";
import { SearchWallet } from "domains/wallet/components/SearchWallet";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { defaultStyle } from "./NavigationBar.styles";

const commonAssets = images.common;

type MenuItem = {
	title: string;
	mountPath: any;
};

type NavigationBarProps = {
	profile?: Profile;
	menu?: MenuItem[];
	userActions?: Action[];
	avatarImage?: string;
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

type UserInfoProps = {
	avatarImage?: string;
	currencyIcon?: string;
	onUserAction?: any;
	userActions?: Action[];
	userInitials?: string;
};

const UserInfo = ({ currencyIcon, onUserAction, avatarImage, userActions, userInitials }: UserInfoProps) => (
	<Dropdown
		onSelect={onUserAction}
		options={userActions}
		toggleContent={(isOpen: boolean) => (
			<div className="cursor-pointer" data-testid="navbar__useractions">
				<Circle className="-mr-2 border-theme-neutral-300" size="lg">
					<span className="text-theme-neutral-600">{currencyIcon && <Icon name={currencyIcon} />}</span>
				</Circle>
				{avatarImage?.endsWith("</svg>") ? (
					<div
						className="relative inline-flex items-center justify-center align-middle rounded-full"
						data-testid="navbar__user--avatar"
					>
						<img
							className="rounded-full w-11 h-11"
							src={`data:image/svg+xml;utf8,${avatarImage}`}
							alt="Profile avatar"
						/>
						<span className="absolute text-sm font-semibold text-theme-background">{userInitials}</span>
						<Badge
							className={`transform ${
								isOpen ? "rotate-180" : ""
							} bg-theme-primary-contrast border-theme-primary-contrast text-theme-primary-500`}
							position="right"
							icon="ChevronDown"
							iconWidth={10}
							iconHeight={10}
						/>
					</div>
				) : (
					<div
						className="relative inline-flex items-center justify-center align-middle rounded-full bg-theme-neutral-contrast w-11 h-11"
						data-testid="navbar__user--avatarImage"
					>
						<img
							className="object-cover bg-center bg-no-repeat bg-cover rounded-full w-11 h-11"
							src={avatarImage}
							alt="Profile avatar"
						/>
						<Badge
							className={`transform ${
								isOpen ? "rotate-180" : ""
							} bg-theme-primary-contrast border-theme-primary-contrast text-theme-primary-500`}
							position="right"
							icon="ChevronDown"
							iconWidth={10}
							iconHeight={10}
						/>
					</div>
				)}
			</div>
		)}
	/>
);

export const NavigationBar = ({
	profile,
	menu,
	userActions,
	notifications,
	onNotificationAction,
}: NavigationBarProps) => {
	const history = useHistory();
	const { t } = useTranslation();

	const [isSearchingWallet, setIsSearchingWallet] = useState(false);
	const [receiveFundsIsOpen, setReceiveFundsIsOpen] = useState(false);

	const renderMenu = () => {
		if (!profile?.id()) {
			return null;
		}

		return (
			menu &&
			menu.map((menuItem: any, index: number) => (
				<li key={index} className="flex">
					<NavLink
						to={menuItem.mountPath(profile.id())}
						title={menuItem.title}
						className="flex items-center mx-4 font-bold text-md text-theme-neutral"
					>
						{menuItem.title}
					</NavLink>
				</li>
			))
		);
	};

	const getUserInitials = () => {
		const name = profile?.settings().get(ProfileSetting.Name);
		return name ? (name as string).slice(0, 2).toUpperCase() : undefined;
	};

	const getCurrencyIcon = () => {
		// TODO get full name from SDK
		const currencyIcons: Record<string, string> = {
			btc: "Bitcoin",
			eth: "Ethereum",
		};

		const currency = profile?.settings().get(ProfileSetting.ExchangeCurrency);

		return currency ? currencyIcons[(currency as string).toLowerCase()] : undefined;
	};

	const handleSearchWallet = () => {
		setIsSearchingWallet(false);

		return setReceiveFundsIsOpen(true);
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
							<NavLink
								to={`/profiles/${profile?.id()}/transactions/transfer`}
								data-testid="navbar__buttons--send"
							>
								<Icon name="Sent" width={22} height={22} />
							</NavLink>
						</div>

						<div className="h-8 border-r border-theme-neutral-200" />

						<div className="flex items-center h-full px-6 cursor-pointer text-theme-primary-300">
							<Button
								variant="transparent"
								onClick={() => setIsSearchingWallet(true)}
								data-testid="navbar__buttons--receive"
							>
								<Icon name="Receive" width={22} height={22} />
							</Button>
						</div>

						<div className="h-8 border-r border-theme-neutral-200" />

						<div className="p-2 ml-4 text-right">
							<div className="text-xs text-theme-neutral">{t("COMMON.YOUR_BALANCE")}</div>
							<div className="text-sm font-bold text-theme-neutral-dark">
								{profile?.balance().toHuman(8)}
							</div>
						</div>

						<div className="flex p-1 cusror-pointer">
							<UserInfo
								userInitials={getUserInitials()}
								currencyIcon={getCurrencyIcon()}
								avatarImage={profile?.avatar()}
								userActions={userActions}
								onUserAction={(action: any) => history.push(action.mountPath(profile?.id()))}
							/>
						</div>
					</div>
				</div>
			</div>
			<SearchWallet
				isOpen={isSearchingWallet}
				onSearch={handleSearchWallet}
				onClose={() => setIsSearchingWallet(false)}
			/>
			<ReceiveFunds isOpen={receiveFundsIsOpen} handleClose={() => setReceiveFundsIsOpen(false)} />
		</NavWrapper>
	);
};

NavigationBar.defaultProps = {
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
