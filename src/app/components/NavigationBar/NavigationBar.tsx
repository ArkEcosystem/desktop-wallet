import { CURRENCIES } from "@arkecosystem/platform-sdk/dist/data";
import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { images } from "app/assets/images";
import { AvatarWrapper } from "app/components/Avatar";
import { Badge } from "app/components/Badge";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { NotificationsDropdown } from "app/components/Notifications";
import { Action } from "app/components/Notifications/models";
import { Tooltip } from "app/components/Tooltip";
import { ReceiveFunds } from "domains/wallet/components/ReceiveFunds";
import { SearchWallet } from "domains/wallet/components/SearchWallet";
import { SelectedWallet } from "domains/wallet/components/SearchWallet/SearchWallet.models";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import tw, { css, styled } from "twin.macro";
import { NavbarVariant } from "types";
import { openExternal } from "utils/electron-utils";

import { Amount } from "../Amount";
import { defaultStyle } from "./NavigationBar.styles";

const { ARKLogo } = images.common;

type MenuItem = {
	title: string;
	mountPath: any;
};

type NavigationBarProps = {
	title?: string;
	profile?: Profile;
	variant?: NavbarVariant;
	menu?: MenuItem[];
	userActions?: Action[];
	avatarImage?: string;
	onUserAction?: any;
};

const NavWrapper = styled.nav<{ noShadow?: boolean }>`
	${defaultStyle}
	${tw`sticky inset-x-0 top-0 bg-theme-background`}
	${({ noShadow }) => !noShadow && tw`shadow-header-smooth dark:shadow-header-smooth-dark`};
`;

type UserInfoProps = {
	avatarImage?: string;
	exchangeCurrency?: string;
	onUserAction?: any;
	userActions?: Action[];
	userInitials?: string;
};

const UserInfo = ({ exchangeCurrency, onUserAction, avatarImage, userActions, userInitials }: UserInfoProps) => {
	const tickerConfig: typeof CURRENCIES["BTC"] | undefined = CURRENCIES[exchangeCurrency as keyof typeof CURRENCIES];

	return (
		<Dropdown
			onSelect={onUserAction}
			options={userActions}
			dropdownClass="mt-8 -mr-4"
			toggleContent={(isOpen: boolean) => (
				<div className="my-0.5 ml-4 -space-x-2 cursor-pointer" data-testid="navbar__useractions">
					<Circle className="border-theme-primary-100 dark:border-theme-secondary-800" size="lg">
						<span className="text-theme-secondary-text dark:text-theme-secondary-800">
							{exchangeCurrency && (
								<Icon
									name={exchangeCurrency}
									fallback={<span className="font-semibold">{tickerConfig?.symbol}</span>}
								/>
							)}
						</span>
					</Circle>

					<div
						className="inline-flex relative justify-center items-center align-middle rounded-full"
						data-testid="navbar__user--avatar"
					>
						<AvatarWrapper size="lg">
							{avatarImage?.endsWith("</svg>") ? (
								<>
									<img alt="Profile Avatar" src={`data:image/svg+xml;utf8,${avatarImage}`} />
									<span className="absolute text-sm font-semibold text-theme-background dark:text-theme-text">
										{userInitials}
									</span>
								</>
							) : (
								<img
									alt="Profile Avatar"
									className="object-cover w-11 h-11 bg-center bg-no-repeat bg-cover rounded-full"
									src={avatarImage}
								/>
							)}
						</AvatarWrapper>

						<Badge
							className="bg-theme-primary-100 border-theme-primary-100 text-theme-primary-500 dark:bg-theme-secondary-800 dark:border-theme-secondary-800 dark:text-theme-text"
							position="right"
							icon="ChevronDown"
							iconClass={`transition-transform ${isOpen ? "transform rotate-180" : ""}`}
							iconWidth={8}
							iconHeight={5}
						/>
					</div>
				</div>
			)}
		/>
	);
};

const ButtonWrapper = styled.div`
	${css`
		button {
			${tw`w-12 h-12 overflow-hidden rounded-lg text-theme-primary-300 dark:text-theme-secondary-600 not-disabled:(hover:text-theme-primary-700 hover:bg-theme-primary-50 dark:hover:bg-theme-secondary-800 dark:hover:text-theme-secondary-200)`};
		}
	`};
`;

const LogoContainer = styled.div`
	${tw`flex items-center justify-center w-12 h-12 my-auto mr-4 text-white rounded bg-logo`};
`;

export const NavigationBar = ({ title, profile, variant, menu, userActions }: NavigationBarProps) => {
	const history = useHistory();
	const { t } = useTranslation();

	const [searchWalletIsOpen, setSearchWalletIsOpen] = useState(false);
	const [receiveFundsIsOpen, setReceiveFundsIsOpen] = useState(false);

	const [selectedWallet, setSelectedWallet] = useState<SelectedWallet | undefined>();

	useEffect(() => {
		if (selectedWallet) {
			setSearchWalletIsOpen(false);
			setReceiveFundsIsOpen(true);
		}
	}, [selectedWallet]);

	const handleSelectWallet = (wallet: SelectedWallet) => {
		setSelectedWallet(wallet);
	};

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
						className="flex items-center px-1 font-semibold transition-colors duration-200 text-md text-theme-secondary-text"
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

	const getExchangeCurrency = () => profile?.settings().get<string>(ProfileSetting.ExchangeCurrency);

	const profileWalletsCount = profile?.wallets().count();
	const wallets = useMemo(() => {
		if (!profile) {
			return [];
		}

		if (profile?.settings().get(ProfileSetting.UseTestNetworks)) {
			return profile?.wallets().values();
		}

		return profile
			?.wallets()
			.values()
			.filter((wallet) => wallet.network().isLive());
	}, [profile, profileWalletsCount]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<NavWrapper aria-labelledby="main menu" noShadow={variant !== "full"}>
			<div className="px-4 sm:px-6 lg:px-10">
				<div className="flex relative justify-between h-20 md:h-24">
					<div className="flex items-center my-auto">
						<LogoContainer>
							<ARKLogo width={48} />
						</LogoContainer>

						{title && <span className="text-2xl font-bold">{title}</span>}
					</div>

					{variant === "full" && (
						<>
							<ul className="flex mr-auto ml-4 space-x-8 h-20 md:h-24">{renderMenu()}</ul>

							<div className="flex items-center my-auto space-x-4">
								{profile && <NotificationsDropdown profile={profile} />}

								<div className="h-8 border-r border-theme-secondary-300 dark:border-theme-secondary-800" />

								<div className="flex items-center">
									<Tooltip content={wallets.length ? undefined : t("COMMON.NOTICE_NO_WALLETS")}>
										<ButtonWrapper>
											<Button
												data-testid="navbar__buttons--send"
												disabled={!wallets.length}
												size="icon"
												variant="transparent"
												onClick={() => history.push(`/profiles/${profile?.id()}/send-transfer`)}
											>
												<Icon name="Sent" width={18} height={18} className="p-1" />
											</Button>
										</ButtonWrapper>
									</Tooltip>
								</div>

								<div className="h-8 border-r border-theme-secondary-300 dark:border-theme-secondary-800" />

								<div className="flex overflow-hidden items-center rounded-lg">
									<Tooltip content={wallets.length ? undefined : t("COMMON.NOTICE_NO_WALLETS")}>
										<ButtonWrapper>
											<Button
												data-testid="navbar__buttons--receive"
												disabled={!wallets.length}
												size="icon"
												variant="transparent"
												onClick={() => setSearchWalletIsOpen(true)}
											>
												<Icon name="QrCode" width={22} height={22} className="p-1" />
											</Button>
										</ButtonWrapper>
									</Tooltip>
								</div>

								<div className="h-8 border-r border-theme-secondary-300 dark:border-theme-secondary-800" />
							</div>

							<div className="flex items-center my-auto mr-4 ml-8">
								<div className="text-right">
									<div className="text-xs font-semibold text-theme-secondary-700">
										{t("COMMON.YOUR_BALANCE")}
									</div>
									<div className="text-sm font-bold text-theme-secondary-text dark:text-theme-text">
										<Amount
											value={profile?.convertedBalance() || BigNumber.ZERO}
											ticker={
												profile?.settings().get<string>(ProfileSetting.ExchangeCurrency) || ""
											}
										/>
									</div>
								</div>

								<UserInfo
									userInitials={getUserInitials()}
									exchangeCurrency={getExchangeCurrency()}
									avatarImage={profile?.avatar()}
									userActions={userActions}
									onUserAction={(action: any) => {
										if (action?.isExternal) {
											return openExternal(action.mountPath());
										}

										return history.push(action.mountPath(profile?.id()));
									}}
								/>
							</div>
						</>
					)}
				</div>
			</div>

			{profile && (
				<>
					<SearchWallet
						isOpen={searchWalletIsOpen}
						title={t("WALLETS.MODAL_SELECT_ACCOUNT.TITLE")}
						description={t("WALLETS.MODAL_SELECT_ACCOUNT.DESCRIPTION")}
						searchPlaceholder={t("WALLETS.MODAL_SELECT_ACCOUNT.SEARCH_PLACEHOLDER")}
						wallets={wallets}
						onSelectWallet={handleSelectWallet}
						onClose={() => setSearchWalletIsOpen(false)}
					/>

					{selectedWallet && (
						<ReceiveFunds
							isOpen={receiveFundsIsOpen}
							address={selectedWallet.address}
							icon={selectedWallet.coinName}
							name={selectedWallet.name}
							network={selectedWallet.coinId}
							onClose={() => setSelectedWallet(undefined)}
						/>
					)}
				</>
			)}
		</NavWrapper>
	);
};

NavigationBar.defaultProps = {
	variant: "full",
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
			label: "Votes",
			value: "votes",
			mountPath: (profileId: string) => `/profiles/${profileId}/votes`,
		},
		{
			label: "Settings",
			value: "settings",
			mountPath: (profileId: string) => `/profiles/${profileId}/settings`,
		},
		{
			icon: "Redirect",
			isExternal: true,
			label: "Support",
			value: "support",
			mountPath: () => "https://ark.io/contact",
		},
		{
			label: "Sign Out",
			value: "sign-out",
			mountPath: () => `/`,
		},
	],
};
