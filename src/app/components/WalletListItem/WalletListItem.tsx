import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

import { Dropdown } from "../Dropdown";

export type WalletListItemProps = {
	wallet: Wallet;
	coinClass?: string;
	walletTypeIcons?: any[] | null;
	actions?: any[];
	variant?: "singleAction";
	onAction?: any;
};

export const WalletListItem = ({
	wallet,
	coinClass,
	walletTypeIcons,
	actions,
	variant,
	onAction,
}: WalletListItemProps) => {
	const getIconTypeClass = (icon: string) => {
		if (icon === "Star") return "text-theme-warning-400";
		return "text-theme-neutral-600";
	};

	const onDropdownAction = (action: any) => {
		if (typeof onAction === "function") onAction(action);
	};

	const coinName = wallet?.coin().manifest().get<string>("name");

	return (
		<tr className="border-b border-theme-neutral-200">
			<td className="py-6 mt-1">
				<div className="flex">
					<Circle className={coinClass} size="lg">
						<Icon name={coinName ? upperFirst(coinName.toLowerCase()) : ""} width={20} height={20} />
					</Circle>
					<Avatar size="lg" address={wallet?.address()} />
				</div>
			</td>
			<td className="py-1">
				<Address walletName={wallet.alias()} address={wallet?.address()} maxChars={22} />
			</td>
			{walletTypeIcons && (
				<td className="py-1 text-sm font-bold text-center space-x-2">
					{walletTypeIcons.map((type: string, index: number) => {
						return (
							<div key={index} className={`inline-block align-middle ${getIconTypeClass(type)}`}>
								<Icon name={type} width={16} height={16} />
							</div>
						);
					})}
				</td>
			)}
			<td className="font-semibold text-right">
				<div>{wallet.balance().toString()}</div>
			</td>
			<td className="text-right text-theme-neutral-light">
				<div>{wallet.fiat().toString()}</div>
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
	walletTypeIcons: [],
	actions: [],
	address: "",
};
