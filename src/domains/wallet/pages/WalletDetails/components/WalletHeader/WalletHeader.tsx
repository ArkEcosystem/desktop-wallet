import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Tippy from "@tippyjs/react";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	address: string;
	balance: BigNumber;
	currencyDelta?: number;
	coin: string;
	currencyBalance?: BigNumber;
	exchangeCurrency?: string;
	isLedger?: boolean;
	isMultisig?: boolean;
	isStarred?: boolean;
	name?: string;
	network: string;
	publicKey?: string;
	ticker: string;
	showSignMessageOption?: boolean;
	showStoreHashOption?: boolean;
	showVerifyMessageOption?: boolean;
	onDeleteWallet: () => void;
	onSend?: () => void;
	onSignMessage: () => void;
	onStar: () => void;
	onStoreHash: () => void;
	onUpdateWalletName: () => void;
	onVerifyMessage: () => void;
};

export const WalletHeader = ({
	address,
	balance,
	coin,
	currencyBalance,
	currencyDelta,
	exchangeCurrency,
	isLedger,
	isMultisig,
	isStarred,
	name,
	network,
	publicKey,
	ticker,
	showSignMessageOption,
	showStoreHashOption,
	showVerifyMessageOption,
	onDeleteWallet,
	onSend,
	onSignMessage,
	onStar,
	onStoreHash,
	onUpdateWalletName,
	onVerifyMessage,
}: Props) => {
	const { t } = useTranslation();

	const moreOptionsMenu = [
		{
			label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME"),
			value: "wallet-name",
		},
	];

	return (
		<header data-testid="WalletHeader">
			<div className="py-8 bg-theme-neutral-900">
				<div className="container flex items-center mx-auto px-14">
					<div className="flex items-center w-1/2 pr-12 space-x-4 border-r h-13 border-theme-neutral-800">
						<div className="flex">
							<NetworkIcon
								coin={coin}
								network={network}
								size="lg"
								className="-mr-1 border-theme-neutral-dark text-theme-secondary-text"
								noShadow
							/>
							<Avatar size="lg" address={address} shadowColor="--theme-color-neutral-900" />
						</div>

						<div className="flex flex-col overflow-hidden">
							<div className="flex items-center space-x-5 text-theme-secondary-text">
								<span data-testid="WalletHeader__name" className="text-sm font-semibold">
									{name}
								</span>

								<div className="flex items-center space-x-3">
									{isLedger && (
										<Tippy content={t("COMMON.LEDGER")}>
											<span data-testid="WalletHeader__ledger">
												<Icon
													name="Ledger"
													className="hover:text-theme-neutral"
													width={16}
													height={16}
												/>
											</span>
										</Tippy>
									)}

									{isMultisig && (
										<Tippy content={t("COMMON.MULTISIGNATURE")}>
											<span data-testid="WalletHeader__multisig">
												<Icon
													name="Multisig"
													className="hover:text-theme-neutral"
													width={16}
													height={16}
												/>
											</span>
										</Tippy>
									)}
								</div>
							</div>

							<div className="flex items-center space-x-5">
								<span className="text-lg font-semibold text-white truncate">{address}</span>

								<div className="flex items-end mb-2 space-x-3 text-theme-secondary-text">
									<Clipboard data={address} tooltip={t("WALLETS.PAGE_WALLET_DETAILS.COPY_ADDRESS")}>
										<Icon
											name="CopyAddress"
											className="hover:text-theme-neutral"
											width={13}
											height={21}
										/>
									</Clipboard>

									<Clipboard
										data={publicKey}
										tooltip={t("WALLETS.PAGE_WALLET_DETAILS.COPY_PUBLIC_KEY")}
									>
										<Icon
											name="CopyKey"
											className="hover:text-theme-neutral"
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

								{currencyBalance && (
									<Amount
										value={currencyBalance}
										ticker={exchangeCurrency!}
										data-testid="WalletHeader__currency-balance"
										className="ml-1"
									/>
								)}

								{!!currencyDelta && (
									<span
										className={`inline-flex items-center ml-2 ${
											currencyDelta > 0 ? "text-theme-success" : "text-theme-danger"
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
								value={balance}
								ticker={ticker}
								data-testid="WalletHeader__balance"
								className="text-lg font-semibold text-white"
							/>
						</div>

						<div className="my-auto">
							<Button
								size="icon"
								variant="transparent"
								className="text-theme-secondary-text hover:text-theme-neutral h-11 w-11"
								data-testid="WalletHeader__star-button"
								onClick={onStar}
							>
								<Tippy
									content={
										isStarred
											? t("WALLETS.PAGE_WALLET_DETAILS.UNSTAR_WALLET")
											: t("WALLETS.PAGE_WALLET_DETAILS.STAR_WALLET")
									}
								>
									<span className={isStarred ? "text-theme-warning-400" : ""}>
										<Icon name={isStarred ? "Star" : "StarOutline"} />
									</span>
								</Tippy>
							</Button>
						</div>

						<Button data-testid="WalletHeader__send-button" className="my-auto" onClick={onSend}>
							{t("COMMON.SEND")}
						</Button>

						<div data-testid="WalletHeader__more-button" className="my-auto">
							<Dropdown
								toggleContent={
									<Button variant="plain" size="icon" className="text-left">
										<Icon name="Settings" width={20} height={20} />
									</Button>
								}
								options={[
									{
										label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME"),
										value: "wallet-name",
									},
									{
										label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.SIGN_MESSAGE"),
										value: "sign-message",
									},
									{
										label: t("WALLETS.MODAL_VERIFY_MESSAGE.TITLE"),
										value: "verify-message",
									},
									{ label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.STORE_HASH"), value: "store-hash" },
									{ label: t("WALLETS.PAGE_WALLET_DETAILS.OPTIONS.DELETE"), value: "delete-wallet" },
								]}
								onSelect={(option: Record<string, string>) => {
									if (option.value === "sign-message") {
										onSignMessage();
									}

									if (option.value === "verify-message") {
										onVerifyMessage();
									}

									if (option.value === "delete-wallet") {
										onDeleteWallet();
									}

									if (option.value === "wallet-name") {
										onUpdateWalletName();
									}

									if (option.value === "store-hash") {
										onStoreHash();
									}
								}}
								dropdownClass="top-5 right-3 text-left"
							/>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
