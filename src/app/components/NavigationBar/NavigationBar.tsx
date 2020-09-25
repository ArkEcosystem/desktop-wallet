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
import { SearchBarFilters } from "app/components/SearchBar/SearchBarFilters";
import { useEnvironmentContext } from "app/contexts";
import { ReceiveFunds } from "domains/wallet/components/ReceiveFunds";
import { SearchWallet } from "domains/wallet/components/SearchWallet";
import { SelectedWallet } from "domains/wallet/components/SearchWallet/SearchWallet.models";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import tw, { styled } from "twin.macro";
import { NavbarVariant } from "types";

import { Amount } from "../Amount";
import { defaultStyle } from "./NavigationBar.styles";

const { ARKLogo } = images.common;

type MenuItem = {
	title: string;
	mountPath: any;
};

type NavigationBarProps = {
	profile?: Profile;
	variant?: NavbarVariant;
	menu?: MenuItem[];
	userActions?: Action[];
	avatarImage?: string;
	onUserAction?: any;
};

const NavWrapper = styled.nav<{ noShadow?: boolean }>`
	${defaultStyle}
	${tw`sticky inset-x-0 top-0 bg-white`}
	${({ noShadow }) => !noShadow && tw`shadow-md`};
`;

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
			<div className="ml-4 cursor-pointer" data-testid="navbar__useractions">
				<Circle className="-mr-2 border-theme-primary-contrast" size="lg">
					<span className="text-theme-neutral-dark">{currencyIcon && <Icon name={currencyIcon} />}</span>
				</Circle>

				<div
					className="relative inline-flex items-center justify-center align-middle rounded-full"
					data-testid="navbar__user--avatar"
				>
					<AvatarWrapper size="lg">
						{avatarImage?.endsWith("</svg>") ? (
							<>
								<img alt="Profile Avatar" src={`data:image/svg+xml;utf8,${avatarImage}`} />
								<span className="absolute text-sm font-semibold text-theme-background">
									{userInitials}
								</span>
							</>
						) : (
							<img
								alt="Profile Avatar"
								className="object-cover bg-center bg-no-repeat bg-cover rounded-full w-11 h-11"
								src={avatarImage}
							/>
						)}
					</AvatarWrapper>

					<Badge
						className="bg-theme-primary-contrast border-theme-primary-contrast text-theme-primary-500"
						position="right"
						icon={isOpen ? "ChevronUp" : "ChevronDown"}
						iconWidth={10}
						iconHeight={10}
					/>
				</div>
			</div>
		)}
	/>
);

const LogoContainer = styled.div`
	${tw`flex items-center justify-center my-auto mr-4 text-white rounded-lg bg-logo`};
	width: 50px;
	height: 50px;
`;

export const NavigationBar = ({ profile, variant, menu, userActions }: NavigationBarProps) => {
	const history = useHistory();
	const { t } = useTranslation();

	const [searchWalletIsOpen, setSearchWalletIsOpen] = useState(false);
	const [receiveFundsIsOpen, setReceiveFundsIsOpen] = useState(false);

	const [selectedWallet, setSelectedWallet] = useState<SelectedWallet | undefined>();

	const { env } = useEnvironmentContext();

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
						className="flex items-center mx-4 font-semibold transition-colors duration-200 text-md text-theme-neutral-dark hover:text-theme-neutral-900"
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

	const getCurrencyIcon = () => profile?.settings().get<string>(ProfileSetting.ExchangeCurrency);

	return (
		<NavWrapper aria-labelledby="main menu" noShadow={variant !== "full"}>
			<div className="px-4 sm:px-6 lg:px-10">
				<div className="relative flex justify-between h-20 md:h-24">
					<div className="flex items-center my-auto">
						<LogoContainer>
							<ARKLogo width={40} />
						</LogoContainer>
					</div>

					{variant === "full" && (
						<>
							<ul className="flex h-20 mr-auto md:h-24">{renderMenu()}</ul>

							<div className="flex items-center my-auto space-x-4">
								{profile && <NotificationsDropdown profile={profile} />}

								<div className="h-8 border-r border-theme-neutral-200" />

								<div className="flex items-center overflow-hidden rounded-lg">
									<Button
										variant="transparent"
										size="icon"
										className="text-theme-primary-300 hover:text-theme-primary-dark hover:bg-theme-primary-50"
										onClick={() => history.push(`/profiles/${profile?.id()}/send-transfer`)}
										data-testid="navbar__buttons--send"
									>
										<Icon name="Sent" width={22} height={22} className="p-1" />
									</Button>
								</div>

								<div className="h-8 border-r border-theme-neutral-200" />

								<div className="flex items-center overflow-hidden rounded-lg">
									<Button
										size="icon"
										variant="transparent"
										className="text-theme-primary-300 hover:text-theme-primary-dark hover:bg-theme-primary-50"
										onClick={() => setSearchWalletIsOpen(true)}
										data-testid="navbar__buttons--receive"
									>
										<Icon name="Receive" width={22} height={22} className="p-1" />
									</Button>
								</div>

								<div className="h-8 border-r border-theme-neutral-200" />
							</div>

							<div className="flex items-center my-auto ml-8 mr-4">
								<div className="text-right">
									<div className="text-xs font-medium text-theme-neutral">
										{t("COMMON.YOUR_BALANCE")}
									</div>
									<div className="text-sm font-bold text-theme-neutral-dark">
										<Amount
											value={profile?.balance() || BigNumber.ZERO}
											ticker={
												profile?.settings().get<string>(ProfileSetting.ExchangeCurrency) || ""
											}
										/>
									</div>
								</div>

								<UserInfo
									userInitials={getUserInitials()}
									currencyIcon={getCurrencyIcon()}
									avatarImage={profile?.avatar()}
									userActions={userActions}
									onUserAction={(action: any) => history.push(action.mountPath(profile?.id()))}
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
						showNetwork={false}
						title={t("WALLETS.MODAL_SELECT_ACCOUNT.TITLE")}
						description={t("WALLETS.MODAL_SELECT_ACCOUNT.DESCRIPTION")}
						searchBarExtra={<SearchBarFilters networks={env.availableNetworks()} />}
						wallets={profile.wallets().values()}
						onSelectWallet={handleSelectWallet}
						onClose={() => setSearchWalletIsOpen(false)}
					/>

					{selectedWallet && (
						<ReceiveFunds
							isOpen={receiveFundsIsOpen}
							address={selectedWallet.address}
							name={selectedWallet.name}
							icon={selectedWallet.coinName}
							handleClose={() => setSelectedWallet(undefined)}
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
			label: "Registrations",
			value: "registrations",
			mountPath: (profileId: string) => `/profiles/${profileId}/registrations`,
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
