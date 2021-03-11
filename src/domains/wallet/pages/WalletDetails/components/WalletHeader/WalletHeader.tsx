import { Coins } from "@arkecosystem/platform-sdk";
import { Profile, ProfileSetting, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Dropdown, DropdownOption, DropdownOptionGroup } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import { useEnvironmentContext } from "app/contexts";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { DeleteWallet } from "domains/wallet/components/DeleteWallet";
import { ReceiveFunds } from "domains/wallet/components/ReceiveFunds";
import { SignMessage } from "domains/wallet/components/SignMessage";
import { UpdateWalletName } from "domains/wallet/components/UpdateWalletName";
import { VerifyMessage } from "domains/wallet/components/VerifyMessage";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

type WalletHeaderProps = {
	profile: Profile;
	wallet: ReadWriteWallet;
	currencyDelta?: number;
	onSend?: () => void;
};

export const WalletHeader = ({ profile, wallet, currencyDelta, onSend }: WalletHeaderProps) => {
	const [modal, setModal] = useState<string | undefined>();

	const history = useHistory();

	const { t } = useTranslation();
	const { persist } = useEnvironmentContext();

	const handleStar = async () => {
		wallet.toggleStarred();
		await persist();
	};

	const handleUpdateName = async (name: string) => {
		if (name) {
			wallet.settings().set(WalletSetting.Alias, name);
		} else {
			wallet.settings().forget(WalletSetting.Alias);
		}

		await persist();

		setModal(undefined);
	};

	const handleDeleteWallet = async () => {
		profile.wallets().forget(wallet.id());
		await persist();

		setModal(undefined);

		history.push(`/profiles/${profile.id()}/dashboard`);
	};

	const primaryOptions: DropdownOptionGroup = {
		key: "primary",
		title: t("WALLETS.PAGE_WALLET_DETAILS.PRIMARY_OPTIONS"),
		options: [
			{
				label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME"),
				value: "wallet-name",
			},
			{
				label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.RECEIVE_FUNDS"),
				secondaryLabel: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.RECEIVE_FUNDS_QR"),
				value: "receive-funds",
			},
		],
	};

	const registrationOptions: DropdownOptionGroup = {
		key: "registrations",
		title: t("WALLETS.PAGE_WALLET_DETAILS.REGISTRATION_OPTIONS"),
		options: [],
	};

	if (!wallet.isLedger()) {
		if (wallet.hasSyncedWithNetwork()) {
			if (wallet.network().can(Coins.FeatureFlag.TransactionDelegateRegistration) && !wallet.isDelegate()) {
				registrationOptions.options.push({
					label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.REGISTER_DELEGATE"),
					value: "delegate-registration",
				});
			}

			if (
				wallet.network().can(Coins.FeatureFlag.TransactionDelegateResignation) &&
				wallet.isDelegate() &&
				!wallet.isResignedDelegate()
			) {
				registrationOptions.options.push({
					label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.RESIGN_DELEGATE"),
					value: "delegate-resignation",
				});
			}

			if (wallet.network().can(Coins.FeatureFlag.TransactionSecondSignature) && !wallet.isSecondSignature()) {
				registrationOptions.options.push({
					label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.SECOND_SIGNATURE"),
					value: "second-signature",
				});
			}
		}

		if (wallet.network().can(Coins.FeatureFlag.TransactionMultiSignature)) {
			registrationOptions.options.push({
				label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.MULTISIGNATURE"),
				value: "multi-signature",
			});
		}
	}

	const additionalOptions: DropdownOptionGroup = {
		key: "additional",
		title: t("WALLETS.PAGE_WALLET_DETAILS.ADDITIONAL_OPTIONS"),
		options: [],
	};

	if (wallet.network().can(Coins.FeatureFlag.MessageSign)) {
		additionalOptions.options.push({
			label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.SIGN_MESSAGE"),
			value: "sign-message",
		});
	}

	if (wallet.network().can(Coins.FeatureFlag.MessageVerify)) {
		additionalOptions.options.push({
			label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.VERIFY_MESSAGE"),
			value: "verify-message",
		});
	}

	if (wallet.network().can(Coins.FeatureFlag.TransactionIpfs)) {
		additionalOptions.options.push({
			label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.STORE_HASH"),
			value: "store-hash",
		});
	}

	const secondaryOptions = {
		key: "secondary",
		hasDivider: true,
		options: [
			{
				icon: "Trash",
				iconPosition: "start",
				iconWidth: 18,
				iconHeight: 18,
				label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.DELETE"),
				value: "delete-wallet",
			},
		],
	};

	const handleSelect = (option: DropdownOption) => {
		if (option.value === "multi-signature") {
			history.push(`/profiles/${profile.id()}/wallets/${wallet.id()}/send-registration/multiSignature`);
		}

		if (option.value === "second-signature") {
			history.push(`/profiles/${profile.id()}/wallets/${wallet.id()}/send-registration/secondSignature`);
		}

		if (option.value === "delegate-registration") {
			history.push(`/profiles/${profile.id()}/wallets/${wallet.id()}/send-registration/delegateRegistration`);
		}

		if (option.value === "delegate-resignation") {
			history.push(`/profiles/${profile.id()}/wallets/${wallet.id()}/send-delegate-resignation`);
		}

		if (option.value === "store-hash") {
			history.push(`/profiles/${profile.id()}/wallets/${wallet.id()}/send-ipfs`);
		}

		setModal(option.value?.toString());
	};

	return (
		<>
			<header className="flex items-center" data-testid="WalletHeader">
				<div className="flex items-center w-1/2 pr-12 space-x-4 border-r h-13 border-theme-secondary-800">
					<div className="flex -space-x-1">
						<NetworkIcon
							coin={wallet.coinId()}
							network={wallet.networkId()}
							size="lg"
							className="border-theme-secondary-700 text-theme-secondary-text"
							noShadow
						/>
						<Avatar size="lg" address={wallet.address()} shadowColor="--theme-color-secondary-900" />
					</div>

					<div className="flex overflow-hidden flex-col">
						<div className="flex items-center space-x-5 text-theme-secondary-text">
							{wallet.alias() && (
								<span data-testid="WalletHeader__name" className="text-sm font-semibold">
									{wallet.alias()}
								</span>
							)}

							<div className="flex items-center space-x-3">
								{wallet.isLedger() && (
									<Tooltip content={t("COMMON.LEDGER")}>
										<span data-testid="WalletHeader__ledger">
											<Icon
												name="Ledger"
												className="hover:text-theme-secondary-500"
												width={16}
												height={16}
											/>
										</span>
									</Tooltip>
								)}

								{wallet.hasSyncedWithNetwork() && wallet.isMultiSignature() && (
									<Tooltip content={t("COMMON.MULTISIGNATURE")}>
										<span data-testid="WalletHeader__multisig">
											<Icon
												name="Multisig"
												className="hover:text-theme-secondary-500"
												width={20}
												height={20}
											/>
										</span>
									</Tooltip>
								)}
							</div>
						</div>

						<div className="flex items-center space-x-5">
							<span className="text-lg font-semibold text-white truncate">{wallet.address()}</span>

							<div className="flex items-end mb-2 space-x-3 text-theme-secondary-text">
								<Clipboard
									data={wallet.address()}
									tooltip={t("WALLETS.PAGE_WALLET_DETAILS.COPY_ADDRESS")}
								>
									<Icon
										name="CopyAddress"
										className="hover:text-theme-secondary-500"
										width={13}
										height={21}
									/>
								</Clipboard>

								<Clipboard
									data={wallet.publicKey()}
									tooltip={t("WALLETS.PAGE_WALLET_DETAILS.COPY_PUBLIC_KEY")}
								>
									<Icon
										name="CopyKey"
										className="hover:text-theme-secondary-500"
										width={17}
										height={21}
									/>
								</Clipboard>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center w-1/2 pl-12 space-x-2 h-13">
					<div className="flex flex-col mr-auto">
						<div className="flex items-center text-sm font-semibold text-theme-secondary-text">
							<span>{t("COMMON.BALANCE")}:</span>

							{wallet.convertedBalance() && (
								<Amount
									value={wallet.convertedBalance()}
									ticker={profile.settings().get<string>(ProfileSetting.ExchangeCurrency)!}
									data-testid="WalletHeader__currency-balance"
									className="ml-1"
									normalize={false}
								/>
							)}

							{!!currencyDelta && (
								<span
									className={`inline-flex items-center ml-2 ${
										currencyDelta > 0 ? "text-theme-success-600" : "text-theme-danger-500"
									}`}
								>
									<Icon
										name="ChevronUp"
										className={currencyDelta < 0 ? "rotate-180" : ""}
										width={10}
									/>
									<span className="ml-1">{currencyDelta}%</span>
								</span>
							)}
						</div>

						<Amount
							value={wallet.balance()}
							ticker={wallet.currency()}
							data-testid="WalletHeader__balance"
							className="text-lg font-semibold text-white"
						/>
					</div>

					<div className="my-auto">
						<Button
							size="icon"
							variant="transparent"
							className="w-11 h-11 text-theme-secondary-text hover:text-theme-secondary-500"
							data-testid="WalletHeader__star-button"
							onClick={handleStar}
						>
							<Tooltip
								content={
									wallet.isStarred()
										? t("WALLETS.PAGE_WALLET_DETAILS.UNSTAR_WALLET")
										: t("WALLETS.PAGE_WALLET_DETAILS.STAR_WALLET")
								}
							>
								<span className={wallet.isStarred() ? "text-theme-warning-400" : ""}>
									<Icon name={wallet.isStarred() ? "Star" : "StarOutline"} />
								</span>
							</Tooltip>
						</Button>
					</div>

					<Button
						data-testid="WalletHeader__send-button"
						disabled={wallet.balance().isZero()}
						className="my-auto"
						onClick={onSend}
					>
						{t("COMMON.SEND")}
					</Button>

					<div data-testid="WalletHeader__more-button" className="my-auto">
						<Dropdown
							toggleContent={
								<Button variant="secondary" size="icon" className="text-left">
									<Icon name="Settings" width={20} height={20} />
								</Button>
							}
							onSelect={handleSelect}
							options={[primaryOptions, registrationOptions, additionalOptions, secondaryOptions]}
							dropdownClass="top-5 right-3 text-left"
						/>
					</div>
				</div>
			</header>

			{modal === "sign-message" && (
				<SignMessage isOpen={true} onClose={() => setModal(undefined)} onCancel={() => setModal(undefined)} />
			)}

			<VerifyMessage
				isOpen={modal === "verify-message"}
				onClose={() => setModal(undefined)}
				onCancel={() => setModal(undefined)}
				walletId={wallet.id()}
				profileId={profile.id()}
				signatory={wallet.publicKey()}
			/>

			<ReceiveFunds
				isOpen={modal === "receive-funds"}
				address={wallet.address()}
				icon={wallet.coinId()}
				name={wallet.alias()}
				network={wallet.network()}
				onClose={() => setModal(undefined)}
			/>

			<UpdateWalletName
				currentAlias={wallet.alias()}
				walletId={wallet.id()}
				profile={profile}
				isOpen={modal === "wallet-name"}
				onClose={() => setModal(undefined)}
				onCancel={() => setModal(undefined)}
				onSave={handleUpdateName}
			/>

			<DeleteWallet
				isOpen={modal === "delete-wallet"}
				onClose={() => setModal(undefined)}
				onCancel={() => setModal(undefined)}
				onDelete={handleDeleteWallet}
			/>
		</>
	);
};
