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
				<Card>
					<div className="p-2">
						<div className="flex">
							<Circle size="lg" className="-mr-2 bg-theme-background border-theme-primary-contrast" />
							<Circle size="lg" className="bg-theme-background border-theme-primary-contrast" />
						</div>

						<div className={`mt-6 text-md text-theme-primary-contrast font-medium ${blankTitleClass}`}>
							{blankTitle}
						</div>
						<div className={`text-md text-theme-primary-contrast font-bold ${blankSubtitleClass}`}>
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
				actions={actions}
				onClick={() => history.push(`/profiles/${activeProfile.id()}/wallets/${wallet.id()}`)}
				onSelect={onSelect}
			>
				<div className="relative p-2">
					<div className="-space-x-2">
						<NetworkIcon size="lg" coin={wallet.coinId()} network={wallet.networkId()} />
						<Avatar size="lg" address={wallet.address()} />
					</div>

					<div className="flex mt-6 truncate max-w-12">
						<Address walletName={wallet.alias()} address={wallet.address()} maxChars={13} />
					</div>
					<Amount
						value={wallet.balance()}
						ticker={wallet.network().ticker()}
						className="font-bold text-theme-text"
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
