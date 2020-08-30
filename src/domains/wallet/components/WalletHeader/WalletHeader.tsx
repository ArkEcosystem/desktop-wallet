import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Tippy from "@tippyjs/react";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Section } from "app/components/Layout";
import { Toggle } from "app/components/Toggle";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	address?: string;
	balance: BigNumber;
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
	exchangeCurrency,
	isLedger,
	isMultisig,
	isStarred,
	name,
	network,
	publicKey,
	ticker,
	onDeleteWallet,
	onSend,
	onSignMessage,
	onStar,
	onStoreHash,
	onUpdateWalletName,
	onVerifyMessage,
}: Props) => {
	const [showPublicKey, setShowPublicKey] = React.useState(false);

	const { t } = useTranslation();

	return (
		<header data-testid="WalletHeader">
			<div className="py-8 bg-theme-neutral-900">
				<div className="container flex items-center justify-between mx-auto px-14">
					<div className="flex items-center space-x-4">
						<div className="flex">
							<NetworkIcon
								coin={coin}
								network={network}
								className="-mr-1 border-theme-neutral-dark text-theme-neutral-dark"
								noShadow
							/>
							<Avatar address={address} shadowColor="--theme-color-neutral-900" />
						</div>
						<h2 data-testid="WalletHeader__name" className="mb-0 text-white">
							{name}
						</h2>
						{isLedger && (
							<Tippy content={t("COMMON.LEDGER")}>
								<span data-testid="WalletHeader__ledger">
									<Icon name="Ledger" className="text-theme-neutral-dark" />
								</span>
							</Tippy>
						)}
						{isMultisig && (
							<Tippy content={t("COMMON.MULTISIGNATURE")}>
								<span data-testid="WalletHeader__multisig">
									<Icon name="Multisig" className="text-theme-neutral-dark" />
								</span>
							</Tippy>
						)}
					</div>
					<div className="flex items-stretch space-x-2">
						<Tippy
							content={
								isStarred
									? t("WALLETS.PAGE_WALLET_DETAILS.UNSTAR_WALLET")
									: t("WALLETS.PAGE_WALLET_DETAILS.STAR_WALLET")
							}
						>
							<div className="my-auto">
								<button
									data-testid="WalletHeader__star-button"
									className="p-1 mx-2 outline-none text-theme-neutral-dark"
									onClick={onStar}
								>
									<Icon name={isStarred ? "Star" : "StarOutline"} />
								</button>
							</div>
						</Tippy>

						<Button data-testid="WalletHeader__send-button" onClick={onSend}>
							{t("COMMON.SEND")}
						</Button>

						<div data-testid="WalletHeader__more-button">
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
								dropdownClass="top-5 right-3 text-left bg-white"
							/>
						</div>
					</div>
				</div>
			</div>

			<Section>
				<ul className="flex items-stretch space-x-8 divide-x-1 divide-theme-neutral-300">
					<li className="flex flex-col space-y-2">
						<div className="inline-flex items-center space-x-2">
							<span
								className={`font-semibold text-sm ${
									!showPublicKey ? "text-theme-neutral-dark" : "text-theme-neutral-light"
								}`}
							>
								{t("COMMON.ADDRESS")}
							</span>
							<Toggle
								data-testid="WalletHeader__toggle"
								baseColor="--theme-color-primary"
								disabled={!publicKey}
								onChange={() => setShowPublicKey(!showPublicKey)}
							/>
							<span
								className={`font-semibold text-sm ${
									showPublicKey ? "text-theme-neutral-dark" : "text-theme-neutral-light"
								}`}
							>
								{t("COMMON.PUBLIC_KEY")}
							</span>
						</div>
						<div>
							<span
								data-testid="WalletHeader__address-publickey"
								className="inline-block text-lg font-medium"
							>
								{showPublicKey ? publicKey : address}
							</span>
							<span data-testid="WalletHeader__copy-button" className="ml-4">
								<Clipboard data={showPublicKey ? publicKey : address}>
									<Icon name="Copy" className="text-theme-primary-300" />
								</Clipboard>
							</span>
						</div>
					</li>

					{!showPublicKey && (
						<li className="flex flex-col pl-8 space-y-2">
							<span className="text-sm font-semibold text-theme-neutral-dark">{t("COMMON.BALANCE")}</span>
							<Amount
								value={balance}
								ticker={ticker}
								data-testid="WalletHeader__balance"
								className="text-lg font-semibold"
							/>
						</li>
					)}

					{!showPublicKey && currencyBalance && (
						<li className="flex flex-col pl-8 space-y-2">
							<span className="text-sm font-semibold text-theme-neutral-dark">
								{t("COMMON.FIAT_VALUE")}
							</span>
							<Amount
								value={currencyBalance}
								ticker={exchangeCurrency!}
								data-testid="WalletHeader__currency-balance"
								className="text-lg font-semibold"
							/>
						</li>
					)}
				</ul>
			</Section>
		</header>
	);
};
