import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Card } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { DropdownOption } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { useActiveProfile } from "app/hooks";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Amount } from "../Amount";

type WalletCardProps = {
	className?: string;
	blankTitle: string;
	blankTitleClass?: string;
	blankSubtitleClass?: string;
	blankSubtitle: string;
	wallet?: ReadWriteWallet;
	actions?: DropdownOption[];
	onSelect?: any;
};

export const WalletCard = ({
	blankTitle,
	blankSubtitle,
	blankTitleClass,
	blankSubtitleClass,
	className,
	wallet,
	actions,
	onSelect,
}: WalletCardProps) => {
	const activeProfile = useActiveProfile();

	const history = useHistory();
	const { t } = useTranslation();

	if (wallet === undefined) {
		return (
			<div data-testid="WalletCard__blank" className={`w-64 inline-block ${className}`}>
				<Card className="h-48">
					<div className="flex flex-col justify-between h-full p-2">
						<div className="flex -space-x-2">
							<Circle
								size="lg"
								className="bg-theme-background border-theme-primary-contrast dark:border-theme-neutral-800"
							/>
							<Circle
								size="lg"
								className="bg-theme-background border-theme-primary-contrast dark:border-theme-neutral-800"
							/>
						</div>

						<div
							className={`mt-auto text-theme-primary-contrast dark:text-theme-neutral-800 font-semibold ${blankTitleClass}`}
						>
							{blankTitle}
						</div>
						<div
							className={`text-lg text-theme-primary-contrast dark:text-theme-neutral-800 font-bold ${blankSubtitleClass}`}
						>
							{blankSubtitle}
						</div>
					</div>
				</Card>
			</div>
		);
	}

	const walletTypes = ["Ledger", "MultiSignature", "Starred"];

	const getIconName = (type: string) => {
		switch (type) {
			case "Starred":
				return "Star";
			case "MultiSignature":
				return "Multisig";
			default:
				return type;
		}
	};

	const getIconColor = (type: string) => (type === "Starred" ? "text-theme-warning-400" : "text-theme-neutral-600");

	return (
		<div className={`w-64 inline-block ${className}`} data-testid={`WalletCard__${wallet.address()}`}>
			<Card
				addonIcons={
					!!wallet &&
					wallet.hasSyncedWithNetwork() &&
					walletTypes.map((type: string) =>
						// @ts-ignore
						wallet[`is${type}`]() ? (
							<Tippy key={type} content={t(`COMMON.${type.toUpperCase()}`)}>
								<div className={`inline-block ${getIconColor(type)}`}>
									<Icon name={getIconName(type)} width={18} />
								</div>
							</Tippy>
						) : null,
					)
				}
				className="h-48"
				actions={actions}
				onClick={() => history.push(`/profiles/${activeProfile.id()}/wallets/${wallet.id()}`)}
				onSelect={onSelect}
			>
				<div className="relative flex flex-col justify-between h-full p-2">
					<div className="-space-x-2">
						<NetworkIcon size="lg" coin={wallet.coinId()} network={wallet.networkId()} />
						<Avatar size="lg" address={wallet.address()} />
					</div>

					<div className="flex mt-auto truncate max-w-12">
						<Address
							walletName={wallet.alias()}
							address={wallet.address()}
							maxChars={13}
							walletNameClass="text-theme-neutral-700"
							addressClass="text-theme-neutral-500"
						/>
					</div>
					<Amount
						value={wallet.balance()}
						ticker={wallet.network().ticker()}
						className="text-lg font-bold text-theme-text"
					/>
				</div>
			</Card>
		</div>
	);
};

WalletCard.defaultProps = {
	blankTitle: "New Wallet",
	blankSubtitle: "Balance",
	address: "",
};
