import React from "react";
import { Card } from "../Card";
import { Circle } from "../Circle";
import { Address } from "../Address";
import { Icon } from "../Icon";
import { Dropdown } from "../Dropdown";

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
}: WalletCardProps) => {
	if (isBlank) {
		return (
			<div className={`w-64 inline-block ${className}`}>
				<Card>
					<div>
						<Circle className="-mr-2 border-theme-primary-contrast"></Circle>
						<Circle className="border-theme-primary-contrast"></Circle>
					</div>

					<div className="mt-4 text-sm text-theme-primary-contrast">{blankTitle}</div>
					<div className="mt-1 text-sm text-theme-primary-contrast">{blankSubtitle}</div>
				</Card>
			</div>
		);
	}

	return (
		<div className={`w-64 inline-block ${className}`}>
			<Card>
				<div>
					<Dropdown options={actions} onSelect={onSelect}></Dropdown>
					<div></div>
				</div>
				<div>
					<Circle className={`border-theme-primary-contrast -mr-2 ${coinIconClass}`}>
						{renderCoin(coinIcon)}
					</Circle>
					<Circle avatarId={avatarId} className="border-theme-primary-contrast"></Circle>
				</div>

				<div className="mt-4 truncate max-w-12">
					<Address walletName={walletName} address={address} maxChars={13}></Address>
				</div>
				<div className="font-bold text-theme-neutral-800">{balance}</div>
			</Card>
		</div>
	);
};

WalletCard.defaultProps = {
	isBlank: false,
	blankTitle: "New wallet",
	blankSubtitle: "Balance",
};
