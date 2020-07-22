import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Card } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { useActiveProfile } from "app/hooks/env";
import React from "react";
import { Link } from "react-router-dom";

type WalletCardProps = {
	className?: string;
	isBlank?: boolean;
	blankTitle: string;
	blankTitleClass?: string;
	blankSubtitleClass?: string;
	blankSubtitle: string;
	coinClass?: string;
	wallet?: Wallet;
	actions?: any;
	walletTypeIcons?: any[];
	onSelect?: any;
};

const renderCoin = (coinIcon?: string) => {
	if (!coinIcon) return null;
	return <Icon name={coinIcon} width={18} height={16} />;
};

export const WalletCard = ({
	isBlank,
	blankTitle,
	blankSubtitle,
	blankTitleClass,
	blankSubtitleClass,
	className,
	wallet,
	coinClass,
	actions,
	onSelect,
	walletTypeIcons,
}: WalletCardProps) => {
	const getIconTypeClass = (icon: string) => {
		if (icon === "Star") return "text-theme-warning-400";
		return "text-theme-neutral-600";
	};
	const activeProfile = useActiveProfile();

	if (isBlank) {
		return (
			<div className={`w-64 inline-block ${className}`}>
				<Card>
					<div className="p-2">
						<div>
							<Circle size="lg" className="-mr-2 bg-white border-theme-primary-contrast" />
							<Circle size="lg" className="bg-white border-theme-primary-contrast" />
						</div>

						<div className={`mt-6 text-md text-theme-primary-contrast ${blankTitleClass}`}>
							{blankTitle}
						</div>
						<div className={`mt-1 text-md text-theme-primary-contrast my-px ${blankSubtitleClass}`}>
							{blankSubtitle}
						</div>
					</div>
				</Card>
			</div>
		);
	}

	const coinName = wallet?.coin().manifest().get<string>("name");

	return (
		<Link to={`/profiles/${activeProfile?.id()}/wallets/${wallet?.id()}`}>
			<div className={`w-64 inline-block ${className}`}>
				<Card>
					<div className="relative p-2">
						<div className="absolute -right-2 -top-1 text-theme-neutral-400 hover:text-theme-neutral-500">
							<Dropdown options={actions} onSelect={onSelect} />
						</div>
						<div className="absolute right-3 -top-1">
							{walletTypeIcons &&
								walletTypeIcons.map((type: string, index: number) => {
									return (
										<div key={index} className={`inline-block mr-2 text ${getIconTypeClass(type)}`}>
											<Icon name={type} width={18} />
										</div>
									);
								})}
						</div>
						<div className="flex">
							<Circle size="lg" className={`border-theme-primary-contrast -mr-2 ${coinClass}`}>
								{renderCoin(coinName ? upperFirst(coinName.toLowerCase()) : "")}
							</Circle>
							<Avatar size="lg" address={wallet?.address()} />
						</div>

						<div className="mt-6 truncate max-w-12">
							<Address walletName={wallet?.alias()} address={wallet?.address()} maxChars={13} />
						</div>
						<div className="font-bold text-theme-neutral-900">{wallet?.balance().toString()}</div>
					</div>
				</Card>
			</div>
		</Link>
	);
};

WalletCard.defaultProps = {
	isBlank: false,
	blankTitle: "New wallet",
	blankSubtitle: "Balance",
	address: "",
};
