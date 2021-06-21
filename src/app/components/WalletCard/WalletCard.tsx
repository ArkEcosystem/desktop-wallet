import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Card } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { DropdownOption } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { TruncateMiddleDynamic } from "app/components/TruncateMiddleDynamic";
import { WalletIcons } from "app/components/WalletIcons";
import { useActiveProfile, useWalletAlias } from "app/hooks";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { AmountCrypto } from "../Amount";
import { WalletCardSkeleton } from "./WalletCardSkeleton";

interface WalletCardProperties {
	isLoading: boolean;
	className?: string;
	wallet?: Contracts.IReadWriteWallet;
	actions?: DropdownOption[];
	displayType?: string;
	onSelect?: any;
}

export const WalletCard = ({
	isLoading,
	className,
	wallet,
	actions,
	displayType = "all",
	onSelect,
}: WalletCardProperties) => {
	const activeProfile = useActiveProfile();

	const history = useHistory();
	const { t } = useTranslation();

	const alias = useWalletAlias({
		address: wallet?.address() || "",
		profile: activeProfile,
		coinId: wallet?.coinId(),
		networkId: wallet?.networkId(),
	});

	if (isLoading) {
		return <WalletCardSkeleton />;
	}

	if (wallet === undefined) {
		const walletIcon = () => {
			if (displayType === "all") {
				return;
			}

			return (
				<Icon
					name={displayType === "starred" ? "Star" : "Ledger"}
					className="text-theme-primary-100 dark:text-theme-secondary-800"
					height={16}
				/>
			);
		};

		return (
			<div data-testid="WalletCard__blank" className={`w-64 inline-block ${className}`}>
				<Card addonIcons={walletIcon()} className="h-48">
					<div className="flex flex-col justify-between p-4 h-full">
						<div className="flex -space-x-2">
							<Circle
								size="lg"
								className="bg-theme-background border-theme-primary-100 dark:border-theme-secondary-800"
							/>
							<Circle
								size="lg"
								className="bg-theme-background border-theme-primary-100 dark:border-theme-secondary-800"
							/>
						</div>

						<div className="mt-auto text-lg font-bold text-theme-primary-100 dark:text-theme-secondary-800">
							{t("COMMON.BALANCE")}
						</div>

						<span className="mt-1 text-xs font-semibold truncate text-theme-primary-100 dark:text-theme-secondary-800">
							{t("COMMON.ADDRESS")}
						</span>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className={`w-64 inline-block ${className}`} data-testid={`WalletCard__${wallet.address()}`}>
			<Card
				addonIcons={<WalletIcons wallet={wallet} />}
				className="h-48"
				actions={actions}
				onClick={() => history.push(`/profiles/${activeProfile.id()}/wallets/${wallet.id()}`)}
				onSelect={onSelect}
			>
				<div className="flex relative flex-col justify-between p-4 h-full">
					<div className="flex items-center space-x-4">
						<div className="-space-x-2 whitespace-nowrap">
							<NetworkIcon size="lg" coin={wallet.coinId()} network={wallet.networkId()} />
							<Avatar size="lg" address={wallet.address()} />
						</div>

						<span className="font-semibold truncate text-theme-secondary-text">{alias}</span>
					</div>

					<AmountCrypto
						value={wallet.balance()}
						ticker={wallet.network().ticker()}
						className="mt-auto text-lg font-bold text-theme-text"
					/>

					<TruncateMiddleDynamic
						value={wallet?.address()}
						className="mt-1 text-xs font-semibold whitespace-nowrap text-theme-secondary-text no-ligatures"
					/>
				</div>
			</Card>
		</div>
	);
};

WalletCard.defaultProps = {
	address: "",
};
