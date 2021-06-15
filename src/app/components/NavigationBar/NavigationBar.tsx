import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { NotificationsDropdown } from "app/components/Notifications";
import { Tooltip } from "app/components/Tooltip";
import { useConfiguration } from "app/contexts";
import { useScroll } from "app/hooks";
import { ReceiveFunds } from "domains/wallet/components/ReceiveFunds";
import { SearchWallet } from "domains/wallet/components/SearchWallet";
import { SelectedWallet } from "domains/wallet/components/SearchWallet/SearchWallet.models";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { openExternal } from "utils/electron-utils";

import { BackButton } from "./components/BackButton";
import { Balance } from "./components/Balance";
import { UserInfo } from "./components/UserInfo";
import { NavigationBarProps } from "./NavigationBar.contract";
import { getUserInitials, getWallets, renderMenu } from "./NavigationBar.helpers";
import { LogoContainer, NavigationButtonWrapper, NavWrapper } from "./NavigationBar.styles";

const { ARKLogo } = images.common;

const NavigationBar = ({
	title,
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

	const { profileIsSyncingExchangeRates } = useConfiguration();

	const wallets = getWallets(profile);
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
							<ul className="flex ml-4 mr-auto space-x-8 h-21">{renderMenu(profile, menu)}</ul>

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
												<Icon name="Send" width={20} height={20} className="p-1" />
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

							<div className="flex items-center my-auto ml-8 space-x-4">
								<Balance profile={profile} isLoading={profileIsSyncingExchangeRates} />

								<UserInfo
									userInitials={getUserInitials(profile)}
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

export { NavigationBar };
