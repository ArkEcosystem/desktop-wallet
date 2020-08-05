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
	onSelect?: any;
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
}: WalletCardProps) => {
	const activeProfile = useActiveProfile();

	if (isBlank) {
		return (
			<div data-testid="WalletCard__blank" className={`w-64 inline-block ${className}`}>
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
		<Link
			to={`/profiles/${activeProfile.id()}/wallets/${wallet?.id()}`}
			data-testid={`WalletCard__${wallet?.address()}`}
		>
			<div className={`w-64 inline-block ${className}`}>
				<Card>
					<div className="relative p-2">
						<div className="absolute -right-2 -top-1 text-theme-neutral-400 hover:text-theme-neutral-500">
							<Dropdown options={actions} onSelect={onSelect} />
						</div>
						<div className="absolute right-3 -top-1">
							{wallet?.isLedger() && (
								<div className="inline-block mr-2 text text-theme-neutral-600">
									<Icon name="Ledger" width={18} />
								</div>
							)}

							{wallet?.hasSyncedWithNetwork() && wallet?.isMultiSignature() && (
								<div className="inline-block mr-2 text text-theme-neutral-600">
									<Icon name="Multisig" width={18} />
								</div>
							)}

							{wallet?.isStarred() && (
								<div className="inline-block mr-2 text text-theme-warning-400">
									<Icon name="Star" width={18} />
								</div>
							)}
						</div>
						<div className="flex">
							<Circle size="lg" className={`border-theme-primary-contrast -mr-2 ${coinClass}`}>
								{coinName && <Icon name={upperFirst(coinName.toLowerCase())} width={18} height={16} />}
							</Circle>
							<Avatar size="lg" address={wallet?.address()} />
						</div>

						<div className="mt-6 truncate max-w-12">
							<Address walletName={wallet?.alias()} address={wallet?.address()} maxChars={13} />
						</div>
						<div className="font-bold text-theme-neutral-900">{wallet?.balance().toHuman(8)}</div>
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
