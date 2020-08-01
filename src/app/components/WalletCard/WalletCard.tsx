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
	coinIcon?: string;
	coinClass?: string;
	walletName?: string;
	id?: string;
	address?: string;
	balance?: string;
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
	id,
	address,
	walletName,
	balance,
	coinIcon,
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

	return (
		<Link to={`/profiles/${activeProfile?.id()}/wallets/${id}`} data-testid={`WalletCard__${id}`}>
			<div className={`w-64 inline-block ${className}`}>
				<Card>
					<div className="relative p-2">
						<div className="absolute top-0 right-0 flex items-center -mr-2 space-x-2">
							{walletTypeIcons &&
								walletTypeIcons.map((type: string, index: number) => (
									<div key={index} className={`inline-block text ${getIconTypeClass(type)}`}>
										<Icon name={type} width={18} />
									</div>
								))}
							<span className="text-theme-neutral-400 hover:text-theme-neutral-500">
								<Dropdown options={actions} onSelect={onSelect} />
							</span>
						</div>
						<div className="flex">
							<Circle size="lg" className={`border-theme-primary-contrast -mr-2 ${coinClass}`}>
								{renderCoin(coinIcon)}
							</Circle>
							<Avatar size="lg" address={address as string} />
						</div>

						<div className="mt-6 truncate max-w-12">
							<Address walletName={walletName} address={address} maxChars={13} />
						</div>
						<div className="font-bold text-theme-neutral-900">{balance}</div>
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
