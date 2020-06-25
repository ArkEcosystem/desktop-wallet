import React from "react";

import { Address } from "../Address";
import { Card } from "../Card";
import { Circle } from "../Circle";
import { Dropdown } from "../Dropdown";
import { Icon } from "../Icon";

type WalletCardProps = {
	className?: string;
	isBlank?: boolean;
	blankTitle: string;
	blankTitleClass?: string;
	blankSubtitleClass?: string;
	blankSubtitle: string;
	avatarId?: string;
	coinIcon?: string;
	coinIconClass?: string;
	walletName?: string;
	address?: string;
	balance?: string;
	actions?: any;
	walletTypeIcons?: any[];
	onSelect?: any;
};

const renderCoin = (coinIcon?: string) => {
	if (!coinIcon) return null;
	return <Icon name={coinIcon} width={16} height={16} />;
};

export const WalletCard = ({
	isBlank,
	blankTitle,
	blankSubtitle,
	blankTitleClass,
	blankSubtitleClass,
	className,
	address,
	walletName,
	balance,
	avatarId,
	coinIcon,
	coinIconClass,
	actions,
	onSelect,
	walletTypeIcons,
}: WalletCardProps) => {
	const getIconTypeClass = (icon: string) => {
		if (icon === "Star") return "text-theme-warning-400";
		return "text-theme-neutral-600";
	};

	if (isBlank) {
		return (
			<div className={`w-64 inline-block ${className}`}>
				<Card>
					<div className="p-2">
						<div>
							<Circle size="large" className="-mr-2 border-theme-primary-contrast bg-white" />
							<Circle size="large" className="border-theme-primary-contrast bg-white" />
						</div>

						<div className={` mt-6 text-md text-theme-primary-contrast ${blankTitleClass}`}>
							{blankTitle}
						</div>
						<div className={` mt-1 text-md text-theme-primary-contrast ${blankSubtitleClass}`}>
							{blankSubtitle}
						</div>
					</div>
				</Card>
			</div>
		);
	}

	return (
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
					<div>
						<Circle size="large" className={`border-theme-primary-contrast -mr-2 ${coinIconClass}`}>
							{renderCoin(coinIcon)}
						</Circle>
						<Circle size="large" avatarId={avatarId} className="border-theme-primary-contrast" />
					</div>

					<div className="mt-6 truncate max-w-12">
						<Address walletName={walletName} address={address} maxChars={13} />
					</div>
					<div className="font-bold text-theme-neutral-900">{balance}</div>
				</div>
			</Card>
		</div>
	);
};

WalletCard.defaultProps = {
	isBlank: false,
	blankTitle: "New wallet",
	blankSubtitle: "Balance",
};
