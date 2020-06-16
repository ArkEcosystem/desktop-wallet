import { Address } from "app/components/Address";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";

import { Dropdown } from "../Dropdown";

type WalletListItemProps = {
	coinIcon: string;
	coinClass?: string;
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
	coinIcon,
	coinClass,
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
				<Circle className={coinClass}>
					<Icon name={coinIcon}></Icon>
				</Circle>
				<Circle avatarId={avatarId}></Circle>
			</td>
			<td className="py-1">
				<Address walletName={walletName} address={address} size="small" maxChars={22}></Address>
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
