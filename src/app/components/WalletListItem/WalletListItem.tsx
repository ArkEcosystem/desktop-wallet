import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

import { Dropdown } from "../Dropdown";

export type WalletListItemProps = {
	wallet: Wallet;
	exchangeCurrency?: string;
	coinClass?: string;
	actions?: any[];
	variant?: "singleAction";
	onAction?: any;
};

export const WalletListItem = ({
	wallet,
	coinClass,
	actions,
	variant,
	onAction,
	exchangeCurrency,
}: WalletListItemProps) => {
	const onDropdownAction = (action: any) => {
		if (typeof onAction === "function") onAction(action);
	};

	const coinName = wallet?.manifest().get<string>("name");
	const hasTypeIcons =
		wallet?.isLedger() || wallet?.isStarred() || (wallet?.hasSyncedWithNetwork() && wallet?.isMultiSignature());

	return (
		<tr className="border-theme-neutral-200 border-b">
			<td className="py-6 mt-1">
				<div className="flex">
					<Circle className={coinClass} size="lg">
						{coinName && <Icon name={upperFirst(coinName.toLowerCase())} width={20} height={20} />}
					</Circle>
					<Avatar size="lg" address={wallet?.address()} />
				</div>
			</td>
			<td className="py-1">
				<Address walletName={wallet?.alias()} address={wallet?.address()} maxChars={22} />
			</td>
			{hasTypeIcons && (
				<td className="py-1 space-x-2 text-sm font-bold text-center">
					{wallet?.isLedger() && (
						<div className="text-theme-neutral-600 inline-block align-middle">
							<Icon name="Ledger" width={16} height={16} />
						</div>
					)}

					{wallet?.isMultiSignature() && (
						<div className="text-theme-neutral-600 inline-block align-middle">
							<Icon name="Multisig" width={16} height={16} />
						</div>
					)}

					{wallet?.isStarred() && (
						<div className="text-theme-warning-400 inline-block align-middle">
							<Icon name="Star" width={16} height={16} />
						</div>
					)}
				</td>
			)}
			<td className="font-semibold text-right">
				<Amount value={wallet.balance()} ticker={wallet.network().currency.ticker} />
			</td>
			<td className="text-theme-neutral-light text-right">
				<Amount value={wallet.convertedBalance()} ticker={exchangeCurrency!} />
			</td>
			<td>
				{actions &&
					actions.length &&
					(() => {
						if (variant === "singleAction") {
							return (
								<div className="text-right">
									<Button data-testid="button" variant="plain" onClick={onDropdownAction}>
										{actions[0].label}
									</Button>
								</div>
							);
						}

						return (
							<div className="text-theme-neutral-light hover:text-theme-neutral">
								<Dropdown options={actions} onSelect={onDropdownAction} />
							</div>
						);
					})()}
			</td>
		</tr>
	);
};

WalletListItem.defaultProps = {
	actions: [],
	address: "",
	exchangeCurrency: "",
};
