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
		return "text-theme-primary-300";
	};

	if (isBlank) {
		return (
			<div className={`w-64 inline-block ${className}`}>
				<Card>
					<div className="px-1 py-2">
						<div className="mt-1">
							<Circle className="-mr-2 border-theme-primary-contrast"></Circle>
							<Circle className="border-theme-primary-contrast"></Circle>
						</div>

						<div className="mt-4 text-md text-theme-primary-contrast">{blankTitle}</div>
						<div className="mt-1 text-md text-theme-primary-contrast">{blankSubtitle}</div>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className={`w-64 inline-block ${className}`}>
			<Card>
				<div className="relative px-1 py-2">
					<div className="-mr-2">
						<Dropdown options={actions} onSelect={onSelect}></Dropdown>
					</div>
					<div className="absolute right-3">
						{walletTypeIcons &&
							walletTypeIcons.map((type: string, index: number) => {
								return (
									<div key={index} className={`inline-block mr-2 text ${getIconTypeClass(type)}`}>
										<Icon name={type} />
									</div>
								);
							})}
					</div>
					<div className="mt-1">
						<Circle className={`border-theme-primary-contrast -mr-2 ${coinIconClass}`}>
							{renderCoin(coinIcon)}
						</Circle>
						<Circle avatarId={avatarId} className="border-theme-primary-contrast"></Circle>
					</div>

					<div className="mt-4 truncate max-w-12">
						<Address walletName={walletName} address={address} maxChars={13}></Address>
					</div>
					<div className="font-bold text-theme-neutral-800">{balance}</div>
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
