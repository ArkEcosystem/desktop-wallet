import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
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
	wallet?: ReadWriteWallet;
	actions?: DropdownOption[];
	onSelect?: any;
};

export const WalletCard = ({ className, wallet, actions, onSelect }: WalletCardProps) => {
	const activeProfile = useActiveProfile();

	const history = useHistory();
	const { t } = useTranslation();

	if (wallet === undefined) {
		return (
			<div data-testid="WalletCard__blank" className={`w-64 inline-block ${className}`}>
				<Card className="h-48">
					<div className="flex flex-col justify-between h-full p-4">
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

						<div className="mt-auto text-lg font-bold text-theme-primary-contrast dark:text-theme-neutral-800">
							{t("COMMON.BALANCE")}
						</div>

						<span className="mt-1 text-xs font-semibold truncate text-theme-primary-contrast dark:text-theme-neutral-800">
							{t("COMMON.ADDRESS")}
						</span>
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
				<div className="relative flex flex-col justify-between h-full p-4">
					<div className="flex items-center space-x-4">
						<div className="-space-x-2 whitespace-no-wrap">
							<NetworkIcon size="lg" coin={wallet.coinId()} network={wallet.networkId()} />
							<Avatar size="lg" address={wallet.address()} />
						</div>

						<span className="font-semibold truncate text-theme-secondary-text">{wallet.alias()}</span>
					</div>

					<Amount
						value={wallet.balance()}
						ticker={wallet.network().ticker()}
						className="mt-auto text-lg font-bold text-theme-text"
					/>

					<span className="mt-1 text-xs font-semibold truncate text-theme-secondary-text">
						{wallet.address()}
					</span>
				</div>
			</Card>
		</div>
	);
};

WalletCard.defaultProps = {
	address: "",
};
