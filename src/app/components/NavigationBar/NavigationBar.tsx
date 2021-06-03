import { CURRENCIES } from "@arkecosystem/platform-sdk-intl";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { NotificationsDropdown } from "app/components/Notifications";
import { Action } from "app/components/Notifications/models";
import { Tooltip } from "app/components/Tooltip";
import { useConfiguration } from "app/contexts";
import { useScroll } from "app/hooks";
import { ReceiveFunds } from "domains/wallet/components/ReceiveFunds";
import { SearchWallet } from "domains/wallet/components/SearchWallet";
import { SelectedWallet } from "domains/wallet/components/SearchWallet/SearchWallet.models";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import tw, { css, styled } from "twin.macro";
import { NavbarVariant } from "types";
import { openExternal } from "utils/electron-utils";

import { BackButton } from "./components/BackButton";
import { Balance } from "./components/Balance";
import { defaultStyle } from "./NavigationBar.styles";

const { ARKLogo } = images.common;

interface MenuItem {
	title: string;
	mountPath: any;
}

interface NavigationBarProps {
	title?: string;
	backToUrl?: string;
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

const NavWrapper = styled.nav<{ noBorder?: boolean; noShadow?: boolean; scroll?: number }>`
	${defaultStyle}

	${tw`sticky inset-x-0 top-0 transition-all duration-200 border-b border-theme-background bg-theme-background`}

	${({ noBorder, scroll }) => {
		if (!noBorder && !scroll) {
			return tw`border-theme-secondary-300 dark:border-theme-secondary-800`;
		}
	}}

	${({ noShadow, scroll }) => {
		if (!noShadow && scroll) {
			return tw`shadow-header-smooth dark:shadow-header-smooth-dark`;
		}
	}};
`;

interface UserInfoProps {
	avatarImage?: string;
	exchangeCurrency?: string;
	onUserAction?: any;
	userActions?: Action[];
	userInitials?: string;
}

const UserInfo = ({ exchangeCurrency, onUserAction, avatarImage, userActions, userInitials }: UserInfoProps) => {
	const tickerConfig: typeof CURRENCIES["BTC"] | undefined = CURRENCIES[exchangeCurrency as keyof typeof CURRENCIES];

	return (
		<div className="flex my-0.5 ml-4 -space-x-2">
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

			<Dropdown
				onSelect={onUserAction}
				options={userActions}
				dropdownClass="mt-8"
				toggleContent={(isOpen: boolean) => (
					<div
						className="relative items-center justify-center align-middle rounded-full cursor-pointer"
						data-testid="navbar__useractions"
					>
						<Avatar size="lg" highlight={isOpen}>
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
									className="object-cover bg-center bg-no-repeat bg-cover rounded-full w-11 h-11"
									src={avatarImage}
								/>
							)}
						</Avatar>
					</div>
				)}
			/>
		</div>
	);
};

export const NavigationButtonWrapper = styled.div`
	${css`
		button {
			${tw`w-11 h-11 overflow-hidden rounded text-theme-primary-300 dark:text-theme-secondary-600 not-disabled:(hover:text-theme-primary-700 hover:bg-theme-primary-50 dark:hover:bg-theme-secondary-800 dark:hover:text-theme-secondary-200)`};
		}
	`};
`;

const LogoContainer = styled.div`
	${tw`flex items-center justify-center my-auto mr-4 text-white rounded w-11 h-11 bg-logo`};
`;

export const NavigationBar = ({
	title,
	backToUrl,
	isBackDisabled,
	profile,
	variant,
	menu,
	userActions,
	noBorder,
	noShadow,
}: NavigationBarProps) => {
	const history = useHistory();
	const { t } = useTranslation();

	const [searchWalletIsOpen, setSearchWalletIsOpen] = useState(false);

	const [selectedWallet, setSelectedWallet] = useState<SelectedWallet | undefined>();

	const handleSelectWallet = (wallet: SelectedWallet) => {
		setSearchWalletIsOpen(false);
		setSelectedWallet(wallet);
	};

	const { profileIsRestoring } = useConfiguration();

	const renderMenu = () => {
		if (!profile?.id()) {
			return null;
		}

		return menu.map((menuItem: any, index: number) => (
			<li key={index} className="flex">
				<NavLink
					to={menuItem.mountPath(profile.id())}
					title={menuItem.title}
					className="relative flex items-center font-semibold transition-colors duration-200 text-md text-theme-secondary-text focus:outline-none group"
				>
					<div className="absolute inset-0 -mx-2 rounded ring-theme-primary-400 group-focus:ring-2 group-focus-visible" />
					{menuItem.title}
				</NavLink>
			</li>
		));
	};

	const getUserInitials = () => {
		const name = profile?.settings().get(Contracts.ProfileSetting.Name);
		return name ? (name as string).slice(0, 2).toUpperCase() : undefined;
	};

	const getExchangeCurrency = () => profile?.settings().get<string>(Contracts.ProfileSetting.ExchangeCurrency);

	const profileWalletsCount = profile?.wallets().count();
	const wallets = useMemo(() => {
		if (!profile) {
			return [];
		}

		if (profile?.settings().get(Contracts.ProfileSetting.UseTestNetworks)) {
			return profile?.wallets().values();
		}

		return profile
			?.wallets()
			.values()
			.filter((wallet) => wallet.network().isLive());
	}, [profile, profileWalletsCount]); // eslint-disable-line react-hooks/exhaustive-deps

	const scroll = useScroll();

	return (
		<NavWrapper
			aria-labelledby="main menu"
			noBorder={noBorder !== undefined ? noBorder : variant !== "full"}
			noShadow={noShadow}
			scroll={scroll}
		>
			<div className="relative flex h-21">
				{variant === "full" && <BackButton className="flex w-12" disabled={isBackDisabled} />}

				<div className={`flex flex-1 px-8 ${variant !== "full" ? "ml-12" : ""}`}>
					<div className="flex items-center my-auto">
						<LogoContainer>
							<ARKLogo width={44} />
						</LogoContainer>

						{title && <span className="text-2xl font-bold">{title}</span>}
					</div>

					{variant === "full" && (
						<>
							<ul className="flex ml-4 mr-auto space-x-8 h-21">{renderMenu()}</ul>

							<div className="flex items-center my-auto space-x-4">
								{profile && <NotificationsDropdown profile={profile} />}

								<div className="h-8 border-r border-theme-secondary-300 dark:border-theme-secondary-800" />

								<div className="flex items-center">
									<Tooltip content={wallets.length ? undefined : t("COMMON.NOTICE_NO_WALLETS")}>
										<NavigationButtonWrapper>
											<Button
												data-testid="navbar__buttons--send"
												disabled={!wallets.length}
												size="icon"
												variant="transparent"
												onClick={() => history.push(`/profiles/${profile?.id()}/send-transfer`)}
											>
												<Icon name="Sent" width={18} height={18} className="p-1" />
											</Button>
										</NavigationButtonWrapper>
									</Tooltip>
								</div>

								<div className="h-8 border-r border-theme-secondary-300 dark:border-theme-secondary-800" />

								<div className="flex items-center">
									<Tooltip content={wallets.length ? undefined : t("COMMON.NOTICE_NO_WALLETS")}>
										<NavigationButtonWrapper>
											<Button
												data-testid="navbar__buttons--receive"
												disabled={!wallets.length}
												size="icon"
												variant="transparent"
												onClick={() => setSearchWalletIsOpen(true)}
											>
												<Icon name="QrCode" width={22} height={22} className="p-1" />
											</Button>
										</NavigationButtonWrapper>
									</Tooltip>
								</div>

								<div className="h-8 border-r border-theme-secondary-300 dark:border-theme-secondary-800" />
							</div>

							<div className="flex items-center my-auto ml-8">
								<Balance profile={profile} isLoading={profileIsRestoring} />

								<UserInfo
									userInitials={getUserInitials()}
									exchangeCurrency={getExchangeCurrency()}
									avatarImage={profile?.avatar()}
									userActions={userActions}
									onUserAction={(action: any) => {
										if (action?.isExternal) {
											return openExternal(action.mountPath());
										}

										if (action?.value === "sign-out") {
											profile?.status().reset();
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
						profile={profile}
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
							isOpen={true}
							address={selectedWallet.address}
							icon={selectedWallet.coinName}
							name={selectedWallet.name}
							network={profile.wallets().findByAddress(selectedWallet.address)?.network()}
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
	menu: [],
	userActions: [],
};
