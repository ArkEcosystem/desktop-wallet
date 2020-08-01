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
			<div className="text-theme-primary-300 flex items-center h-full px-6 cursor-pointer">
				<Icon name="Notification" width={22} height={22} />
			</div>
		}
	>
		<div className="w-128 p-8 py-3 mt-2">
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

const UserInfo = ({ currencyIcon, onUserAction, avatarImage, userActions }: UserInfoProps) => (
	<Dropdown
		onSelect={onUserAction}
		options={userActions}
		toggleContent={(isOpen: boolean) => (
			<div className="cursor-pointer" data-testid="navbar__useractions">
				<Circle className="border-theme-neutral-300 -mr-1" size="lg">
					<span className="text-theme-neutral-600">{currencyIcon && <Icon name={currencyIcon} />}</span>
				</Circle>
				{avatarImage?.endsWith("</svg>") ? (
					<div className="relative inline-flex items-center justify-center align-middle rounded-full">
						<img
							className="w-11 h-11 rounded-full"
							src={`data:image/svg+xml;utf8,${avatarImage}`}
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
				) : (
					<div className="bg-theme-neutral-contrast w-11 h-11 relative inline-flex items-center justify-center align-middle rounded-full">
						<img
							className="w-11 h-11 object-cover bg-center bg-no-repeat bg-cover rounded-full"
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
						className="text-md text-theme-neutral flex items-center mx-4 font-bold"
					>
						{menuItem.title}
					</NavLink>
				</li>
			))
		);
	};

	const getUserInitials = () => {
		const name = profile?.settings().get(ProfileSetting.Name);
		return name ? (name as string).slice(0, 2) : undefined;
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
			<div className="sm:px-6 lg:px- px-4">
				<div className="md:h-24 relative flex justify-between h-20">
					<div className="flex items-center flex-shrink-0">
						<div className="bg-logo flex p-2 mr-4 rounded-lg">
							<img src={commonAssets.ARKLogo} className="md:h-8 lg:h-10 h-6" alt="ARK Logo" />
						</div>
						<ul className="md:h-24 flex h-20">{renderMenu()}</ul>
					</div>

					<div className="flex items-center">
						<NotificationsDropdown {...notifications} onAction={onNotificationAction} />

						<div className="border-theme-neutral-200 h-8 border-r" />

						<div className="text-theme-primary-300 flex items-center h-full px-6 cursor-pointer">
							<NavLink
								to={`/profiles/${profile?.id()}/transactions/transfer`}
								data-testid="navbar__buttons--send"
							>
								<Icon name="Sent" width={22} height={22} />
							</NavLink>
						</div>

						<div className="border-theme-neutral-200 h-8 border-r" />

						<div className="text-theme-primary-300 flex items-center h-full px-6 cursor-pointer">
							<Button
								variant="transparent"
								onClick={() => setIsSearchingWallet(true)}
								data-testid="navbar__buttons--receive"
							>
								<Icon name="Receive" width={22} height={22} />
							</Button>
						</div>

						<div className="border-theme-neutral-200 h-8 border-r" />

						<div className="p-2 ml-4 text-right">
							<div className="text-theme-neutral text-xs">{t("COMMON.YOUR_BALANCE")}</div>
							<div className="text-theme-neutral-dark text-sm font-bold">
								{profile?.balance().toString()}
							</div>
						</div>

						<div className="cusror-pointer flex p-1">
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
