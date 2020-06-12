import React from "react";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Address } from "app/components/Address";
import { Dropdown } from "../Dropdown";

type WalletListItemProps = {
	coin: string;
	coinClassName?: string;
	avatarId?: string;
	address?: string;
	walletName?: string;
	balance?: string;
	fiat?: string;
	walletTypeIcons?: any[];
	actions?: any[];
	onAction?: any;
};

export const WalletListItem = ({
	coin,
	coinClassName,
	avatarId,
	address,
	walletName,
	balance,
	fiat,
	walletTypeIcons,
	actions,
	onAction,
}: WalletListItemProps) => {
	const getIconTypeClass = (icon: string) => {
		if (icon === "Star") return "text-theme-warning-400";
		return "text-theme-primary-300";
	};

	const onDropdownAction = (action: any) => {
		if (typeof onAction === "function") onAction(action);
	};

	return (
		<tr className="border-b border-theme-neutral-200">
			<td className="py-4 mt-1">
				<Circle className={coinClassName}>
					<Icon name={coin}></Icon>
				</Circle>
				<Circle avatarId={avatarId}></Circle>
			</td>
			<td className="py-1">
				<Address walletName={walletName} address={address}></Address>
			</td>
			<td className="py-1 text-sm font-bold">
				{walletTypeIcons &&
					walletTypeIcons.map((type: string, index: number) => {
						return (
							<div key={index} className={`inline-block mr-2 text ${getIconTypeClass(type)}`}>
								<Icon name={type} />
							</div>
						);
					})}
			</td>
			<td className="py-1 text-sm font-bold text-right">
				<div>{balance}</div>
			</td>
			<td className="py-1 text-sm font-bold text-right text-theme-neutral-400">
				<div>{fiat}</div>
			</td>
			<td>
				{actions && actions.length > 0 && <Dropdown options={actions} onSelect={onDropdownAction}></Dropdown>}
			</td>
		</tr>
	);
};

WalletListItem.defaultProps = {
	walletTypeIcons: [],
	actions: [],
};
